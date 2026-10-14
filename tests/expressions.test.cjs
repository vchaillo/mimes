const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function load() {
    const container = { addEventListener() {}, replaceChildren(node) { this.child = node; } };
    const context = { Math, document: { getElementById: () => container, createElement: () => ({}) } };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync('assets/js/expressions.js', 'utf8'), context);
    return { context, container };
}
test('empty and single-item datasets never loop or display undefined', () => {
    const { context } = load();
    assert.equal(context.pickExpression(), 'Aucune expression disponible');
    context.expressions = ['One'];
    assert.equal(context.pickExpression(), 'One');
    assert.equal(context.pickExpression(), 'One');
});
test('multiple expressions avoid immediate repetition', () => {
    const { context } = load(); context.expressions = ['One', 'Two'];
    for (let index = 0; index < 100; index++) {
        const previous = context.lastExpression;
        assert.notEqual(context.pickExpression(), previous);
    }
});
test('expression markup is assigned as text instead of HTML', () => {
    const { context, container } = load();
    context.expressions = ['<img src=x onerror=alert(1)>'];
    context.showExpression();
    assert.equal(container.child.textContent, context.expressions[0]);
    assert.equal(container.child.innerHTML, undefined);
});
test('migration retains exactly 34 unique original expressions', async () => {
    const source = fs.readFileSync('assets/js/seed-expressions.js', 'utf8');
    const { seedExpressions } = await import('data:text/javascript,' + encodeURIComponent(source));
    assert.equal(seedExpressions.length, 34);
    assert.equal(new Set(seedExpressions).size, 34);
});
