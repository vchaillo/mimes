const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function element() {
    return {
        style: {}, children: [], handlers: {},
        addEventListener(name, handler) { this.handlers[name] = handler; },
        replaceChildren(...nodes) { this.children = nodes; },
        append(...nodes) { this.children.push(...nodes); }
    };
}
test('new game awards points, finishes at the target, and resets on account change', () => {
    const ids = new Map(); const get = (id) => {
        if (!ids.has(id)) ids.set(id, element());
        return ids.get(id);
    };
    get('nbPoints').value = '1';
    const window = element();
    const context = {
        document: { getElementById: get, getElementsByClassName: () => [{ value: '<b>Alice</b>' }, { value: 'Bob' }], createElement: element },
        window, expressions: ['Expression'], pickExpression: () => 'Expression', alert: () => assert.fail('Unexpected alert'),
        Math: Object.assign(Object.create(Math), { random: () => 0 })
    };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync('assets/js/game.js', 'utf8'), context);
    get('startButton').handlers.click();
    assert.equal(get('gameWindow').style.display, 'flex');
    assert.equal(get('playersContainer').children[0].children[0].textContent, '<b>Alice</b>');
    get('playersContainer').children[1].handlers.click();
    assert.equal(get('gameExpressionContainer').textContent, 'Bob a remporté la partie !');
    assert.equal(get('newGameButton').hidden, false);
    window.handlers['expression-account-changed']();
    assert.equal(get('gameExpressionContainer').textContent, '');
    assert.equal(get('gameWindow').style.display, 'none');
});
