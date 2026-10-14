const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
async function load() {
    const seed = 'data:text/javascript,' + encodeURIComponent(fs.readFileSync('assets/js/seed-expressions.js', 'utf8'));
    const source = fs.readFileSync('assets/js/personal-expressions.js', 'utf8').replace("'./seed-expressions.js'", JSON.stringify(seed));
    return import('data:text/javascript,' + encodeURIComponent(source));
}
function database() {
    const documents = new Map();
    const sdk = {
        doc: (_, ...path) => path.join('/'),
        serverTimestamp: () => 'timestamp',
        runTransaction: async (_, operation) => {
            const changes = [];
            await operation({
                get: async (ref) => ({ exists: () => documents.has(ref), data: () => documents.get(ref) }),
                set: (ref, data) => changes.push([ref, data])
            });
            changes.forEach(([ref, data]) => documents.set(ref, data));
        }
    };
    return { documents, sdk };
}
test('each account receives its own 34 default expressions', async () => {
    const { initializePersonalExpressions, expressionPath } = await load();
    const { documents, sdk } = database();
    await initializePersonalExpressions({}, sdk, 'alice');
    await initializePersonalExpressions({}, sdk, 'bob');
    assert.equal([...documents.keys()].filter((path) => path.startsWith('users/alice/expressions/')).length, 34);
    assert.equal([...documents.keys()].filter((path) => path.startsWith('users/bob/expressions/')).length, 34);
    assert.deepEqual(expressionPath('alice'), ['users', 'alice', 'expressions']);
    documents.get('users/alice/expressions/default-1').hidden = true;
    assert.equal(documents.get('users/bob/expressions/default-1').hidden, false);
});
test('reconnecting preserves edits, hidden records and deletions, including an empty list', async () => {
    const { initializePersonalExpressions } = await load();
    const { documents, sdk } = database();
    await initializePersonalExpressions({}, sdk, 'alice');
    documents.get('users/alice/expressions/default-1').text = 'My expression';
    documents.get('users/alice/expressions/default-2').hidden = true;
    documents.delete('users/alice/expressions/default-3');
    await initializePersonalExpressions({}, sdk, 'alice');
    assert.equal(documents.get('users/alice/expressions/default-1').text, 'My expression');
    assert.equal(documents.get('users/alice/expressions/default-2').hidden, true);
    assert.equal(documents.has('users/alice/expressions/default-3'), false);
    for (const path of documents.keys()) if (path.startsWith('users/alice/expressions/')) documents.delete(path);
    await initializePersonalExpressions({}, sdk, 'alice');
    assert.equal(documents.size, 1);
});
test('invalid account IDs cannot change the data path', async () => {
    const { expressionPath } = await load();
    assert.throws(() => expressionPath(''));
    assert.throws(() => expressionPath('alice/other'));
});
