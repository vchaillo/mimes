import { firebaseConfig } from './firebase-config.js';
import { seedExpressions } from './seed-expressions.js';

const $ = (id) => document.getElementById(id);
let records = [], db, auth, sdk, unsubscribe, isEditor = false, editingId = null;
let loading = true, busy = false, authGeneration = 0;
const message = (text) => { $('libraryMessage').textContent = text; };
const errors = (error) => {
    console.error(error.code || error.message);
    const messages = {
        'permission-denied': 'Accès refusé. Vérifie les règles Firestore et ton autorisation de gestion.',
        'auth/unauthorized-domain': 'Ce domaine doit être autorisé dans Firebase Authentication.',
        'auth/popup-blocked': 'Autorise la fenêtre de connexion Google dans ton navigateur.',
        'auth/popup-closed-by-user': 'Connexion annulée.',
        'unavailable': 'Firebase est indisponible. Réessaie dans quelques instants.'
    };
    message(messages[error.code] || 'Une erreur est survenue. Réessaie dans quelques instants.');
};
function render() {
    window.expressions = records.filter((r) => !r.hidden).map((r) => r.text);
    $('editorControls').hidden = !isEditor;
    $('importExpressions').disabled = busy || loading;
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
        if (isEditor) {
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
                [record.hidden ? 'Afficher' : 'Masquer', record.hidden ? 'eye' : 'eye-slash', () => mutate(() => sdk.updateDoc(sdk.doc(db, 'expressions', record.id), { hidden: !record.hidden, updatedAt: sdk.serverTimestamp() }))],
                ['Supprimer', 'trash', () => {
                    if (confirm(`Supprimer « ${record.text} » ?`)) mutate(async () => {
                        await sdk.deleteDoc(sdk.doc(db, 'expressions', record.id));
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
    if (!isEditor || busy) return;
    busy = true; $('saveExpression').disabled = true; render(); message('Enregistrement…');
    try { await operation(); message('Modifications enregistrées.'); }
    catch (error) { errors(error); }
    finally { busy = false; $('saveExpression').disabled = false; render(); }
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
        if (id) await sdk.updateDoc(sdk.doc(db, 'expressions', id), { text, updatedAt: sdk.serverTimestamp() });
        else await sdk.addDoc(sdk.collection(db, 'expressions'), { text, hidden: false, createdAt: sdk.serverTimestamp(), updatedAt: sdk.serverTimestamp() });
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
$('importExpressions').addEventListener('click', () => {
    if (loading) return;
    mutate(async () => {
        // Deterministic IDs and transactions prevent overwriting an earlier import.
        for (let index = 0; index < seedExpressions.length; index++) {
            const ref = sdk.doc(db, 'expressions', `original-${String(index + 1).padStart(3, '0')}`);
            await sdk.runTransaction(db, async (transaction) => {
                const existing = await transaction.get(ref);
                if (!existing.exists()) transaction.set(ref, {
                    text: seedExpressions[index], hidden: false,
                    createdAt: sdk.serverTimestamp(), updatedAt: sdk.serverTimestamp()
                });
            });
        }
    });
});
async function initialize() {
    if (!firebaseConfig) {
        records = seedExpressions.map((text, index) => ({ id: `preview-${index}`, text, hidden: false }));
        loading = false;
        $('dataStatus').textContent = 'Liste d’origine · connexion Firebase en attente de configuration.';
        render(); return;
    }
    $('dataStatus').textContent = 'Connexion à Firebase…';
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
            unsubscribe?.(); records = []; isEditor = false; loading = true; resetForm(); render();
            const label = user ? 'Se déconnecter' : 'Se connecter avec Google';
            $('authButton').title = label; $('authButton').setAttribute('aria-label', label);
            $('authButton').firstElementChild.className = `fa-solid fa-${user ? 'right-from-bracket' : 'right-to-bracket'}`;
            $('accountStatus').textContent = user ? (user.displayName || 'Connecté') : '';
            try {
                if (user) isEditor = (await sdk.getDoc(sdk.doc(db, 'editors', user.uid))).exists();
                if (generation !== authGeneration) return;
                $('accountStatus').textContent += user ? (isEditor ? ' · Gestion' : ' · Lecture seule') : '';
                const source = isEditor ? sdk.collection(db, 'expressions') : sdk.query(sdk.collection(db, 'expressions'), sdk.where('hidden', '==', false));
                unsubscribe = sdk.onSnapshot(source, (snapshot) => {
                    loading = false;
                    records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.text.localeCompare(b.text, 'fr'));
                    $('dataStatus').textContent = 'Expressions synchronisées avec Firebase.';
                    if (window.lastExpression && !records.some((r) => !r.hidden && r.text === window.lastExpression)) {
                        window.lastExpression = '';
                        $('expressionText').textContent = 'MimXpression';
                    }
                    render();
                }, (error) => { records = []; loading = true; render(); $('dataStatus').textContent = 'Impossible de charger les expressions.'; errors(error); });
            } catch (error) { errors(error); }
        });
    } catch (error) { $('dataStatus').textContent = 'Impossible de connecter Firebase.'; errors(error); }
}
initialize();
