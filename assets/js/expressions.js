// The library module provides visible expressions from Firestore.
var expressions = [];
var expressionContainer = document.getElementById('expressionContainer');
var lastExpression = '';
function pickExpression() {
    if (!expressions.length) return 'Aucune expression disponible';
    var choices = expressions.filter(function (text) { return text !== lastExpression; });
    if (!choices.length) choices = expressions;
    lastExpression = choices[Math.floor(Math.random() * choices.length)];
    return lastExpression;
}
function showExpression() {
    var heading = document.createElement('h1');
    heading.id = 'expressionText';
    heading.className = 'animate__animated animate__fadeInLeftBig animate__faster';
    heading.textContent = pickExpression();
    expressionContainer.replaceChildren(heading);
}
expressionContainer.addEventListener('click', showExpression);
