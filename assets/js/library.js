import { firebaseConfig } from './firebase-config.js';
import { seedExpressions } from './seed-expressions.js';
import { expressionPath, initializePersonalExpressions } from './personal-expressions.js';

const $ = (id) => document.getElementById(id);
let records = [], db, auth, sdk, unsubscribe, canManage = false, editingId = null;
let loading = true, busy = false, authGeneration = 0;
const message = (text) => { $('libraryMessage').textContent = text; };
const errors = (error) => {
    console.error(error.code || error.message);
    const messages = {
        'permission-denied': 'Accès refusé. Publie les nouvelles règles Firestore puis recharge la page.',
        'auth/unauthorized-domain': 'Ce domaine doit être autorisé dans Firebase Authentication.',
        'auth/popup-blocked': 'Autorise la fenêtre de connexion Google dans ton navigateur.',
        'auth/popup-closed-by-user': 'Connexion annulée.',
        'unavailable': 'Firebase est indisponible. Réessaie dans quelques instants.'
    };
    message(messages[error.code] || 'Une erreur est survenue. Réessaie dans quelques instants.');
};
function render() {
    window.expressions = records.filter((r) => !r.hidden).map((r) => r.text);
    canManage = Boolean(auth?.currentUser) && !loading;
    $('personalControls').hidden = !canManage;
    const search = $('expressionSearch').value.trim().toLocaleLowerCase('fr');
    const filtered = records.filter((r) => r.text.toLocaleLowerCase('fr').includes(search));
    $('expressionCount').textContent = `${filtered.length} expression${filtered.length === 1 ? '' : 's'}`;
    $('expressionItems').replaceChildren();
    for (const record of filtered) {
        const row = document.createElement('li');
        row.className = `expressionRow${record.hidden ? ' isHidden' : ''}`;
        const text = document.createElement('span');
        text.textContent = record.text + (record.hidden ? ' · Masquée' : '');
        row.append(text);
        if (canManage) {
            const actions = document.createElement('div');
            actions.className = 'expressionActions';
            const definitions = [
                ['Modifier', 'pen', () => {
                    editingId = record.id;
                    $('expressionInput').value = record.text;
                    $('saveExpression').textContent = 'Enregistrer';
                    $('cancelEdit').hidden = false;
                    $('expressionInput').focus();
                }],
                [record.hidden ? 'Afficher' : 'Masquer', record.hidden ? 'eye' : 'eye-slash', () => mutate(() => sdk.updateDoc(sdk.doc(db, ...expressionPath(auth.currentUser.uid), record.id), { hidden: !record.hidden, updatedAt: sdk.serverTimestamp() }))],
                ['Supprimer', 'trash', () => {
                    if (confirm(`Supprimer « ${record.text} » ?`)) mutate(async () => {
                        await sdk.deleteDoc(sdk.doc(db, ...expressionPath(auth.currentUser.uid), record.id));
                        if (editingId === record.id) resetForm();
                    });
                }]
            ];
            for (const [label, icon, action] of definitions) {
                const button = document.createElement('button');
                button.type = 'button'; button.className = 'circleButton';
                button.title = label; button.setAttribute('aria-label', `${label} : ${record.text}`);
                button.disabled = busy;
                const glyph = document.createElement('i');
                glyph.className = `fa-solid fa-${icon}`; glyph.setAttribute('aria-hidden', 'true');
                button.append(glyph); button.addEventListener('click', action); actions.append(button);
            }
            row.append(actions);
        }
        $('expressionItems').append(row);
    }
}
function resetForm() {
    editingId = null; $('expressionForm').reset();
    $('saveExpression').textContent = 'Ajouter'; $('cancelEdit').hidden = true;
}
async function mutate(operation) {
    if (!canManage || busy) return;
    const generation = authGeneration;
    busy = true; $('authButton').disabled = true; $('saveExpression').disabled = true; render(); message('Enregistrement…');
    try { await operation(); if (generation === authGeneration) message('Modifications enregistrées.'); }
    catch (error) { if (generation === authGeneration) errors(error); }
    finally { busy = false; $('authButton').disabled = false; $('saveExpression').disabled = false; render(); }
}
$('expressionList').addEventListener('click', (event) => {
    event.preventDefault(); $('libraryContainer').hidden = false;
    $('gameModeContainer').style.display = 'none'; closeMenu();
});
$('expressionSearch').addEventListener('input', render);
$('cancelEdit').addEventListener('click', resetForm);
$('expressionForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = $('expressionInput').value.trim();
    if (!text) { message('Saisis une expression.'); return; }
    const id = editingId;
    mutate(async () => {
        if (id) await sdk.updateDoc(sdk.doc(db, ...expressionPath(auth.currentUser.uid), id), { text, updatedAt: sdk.serverTimestamp() });
        else await sdk.addDoc(sdk.collection(db, ...expressionPath(auth.currentUser.uid)), { text, hidden: false, createdAt: sdk.serverTimestamp(), updatedAt: sdk.serverTimestamp() });
        resetForm();
    });
});
$('authButton').addEventListener('click', async () => {
    if (!auth) { message('La configuration Firebase est attendue.'); $('libraryContainer').hidden = false; closeMenu(); return; }
    $('authButton').disabled = true;
    try {
        if (auth.currentUser) await sdk.signOut(auth);
        else await sdk.signInWithPopup(auth, new sdk.GoogleAuthProvider());
    } catch (error) { errors(error); $('libraryContainer').hidden = false; closeMenu(); }
    finally { $('authButton').disabled = false; }
});
function useDefaults() {
    records = seedExpressions.map((text, index) => ({ id: `default-${index + 1}`, text, hidden: false }));
    loading = false;
    $('dataStatus').textContent = 'Expressions par défaut · connecte-toi pour personnaliser ta liste.';
    render();
}
function resetDisplayedExpression() {
    window.lastExpression = '';
    $('expressionText').textContent = 'MimXpression';
    window.dispatchEvent(new Event('expression-account-changed'));
}
async function initialize() {
    useDefaults();
    if (!firebaseConfig) return;
    $('dataStatus').textContent = 'Chargement…';
    try {
        const base = 'https://www.gstatic.com/firebasejs/12.4.0/';
        const [appSdk, authSdk, firestoreSdk] = await Promise.all([
            import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')
        ]);
        sdk = { ...authSdk, ...firestoreSdk };
        const app = appSdk.initializeApp(firebaseConfig);
        auth = sdk.getAuth(app); db = sdk.getFirestore(app);
        sdk.onAuthStateChanged(auth, async (user) => {
            const generation = ++authGeneration;
            unsubscribe?.(); unsubscribe = null;
            records = []; loading = true; resetForm(); render(); resetDisplayedExpression(); message('');
            const label = user ? 'Se déconnecter' : 'Se connecter avec Google';
            $('authButton').title = label; $('authButton').setAttribute('aria-label', label);
            $('authButton').firstElementChild.className = `fa-solid fa-${user ? 'right-from-bracket' : 'right-to-bracket'}`;
            if (!user) { useDefaults(); return; }
            $('dataStatus').textContent = 'Chargement de tes expressions…';
            try {
                await initializePersonalExpressions(db, sdk, user.uid);
                if (generation !== authGeneration) return;
                unsubscribe = sdk.onSnapshot(sdk.collection(db, ...expressionPath(user.uid)), (snapshot) => {
                    if (generation !== authGeneration) return;
                    loading = false;
                    records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                        .filter((record) => typeof record.text === 'string')
                        .sort((a, b) => a.text.localeCompare(b.text, 'fr'));
                    $('dataStatus').textContent = 'Ta liste personnelle';
                    if (window.lastExpression && !records.some((r) => !r.hidden && r.text === window.lastExpression)) {
                        window.lastExpression = '';
                        $('expressionText').textContent = 'MimXpression';
                    }
                    render();
                }, (error) => {
                    if (generation !== authGeneration) return;
                    records = []; loading = true; render();
                    $('dataStatus').textContent = 'Impossible de charger ta liste.'; errors(error);
                });
            } catch (error) {
                if (generation !== authGeneration) return;
                $('dataStatus').textContent = 'Impossible de charger ta liste.'; errors(error);
            }
        });
    } catch (error) { $('dataStatus').textContent = 'Impossible de connecter Firebase.'; errors(error); }
}
initialize();
