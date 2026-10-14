import { seedExpressions } from './seed-expressions.js';

export function expressionPath(uid) {
    if (!uid || uid.includes('/')) throw new Error('A valid user ID is required.');
    return ['users', uid, 'expressions'];
}
export async function initializePersonalExpressions(db, sdk, uid) {
    const path = expressionPath(uid);
    const userRef = sdk.doc(db, 'users', uid);
    // A single transaction makes first-login initialization safe across devices.
    // The marker preserves deletions even when the personal list becomes empty.
    await sdk.runTransaction(db, async (transaction) => {
        const user = await transaction.get(userRef);
        if (user.exists() && user.data().initialized === true) return;
        seedExpressions.forEach((text, index) => {
            transaction.set(sdk.doc(db, ...path, `default-${index + 1}`), {
                text, hidden: false,
                createdAt: sdk.serverTimestamp(), updatedAt: sdk.serverTimestamp()
            });
        });
        transaction.set(userRef, { initialized: true }, { merge: true });
    });
}
