var gameWindow = document.getElementById('gameWindow');
var gameSettings = document.getElementById('gameSettings');
const gameExpressionContainer = document.getElementById('gameExpressionContainer');
const currentPlayerContainer = document.getElementById('currentPlayerContainer');
const playersContainer = document.getElementById('playersContainer');
let players = [], currentPlayerIndex = 0, targetPoints = 5, finished = false;
function renderPlayers() {
    currentPlayerContainer.textContent = finished ? 'Partie terminée' : `${players[currentPlayerIndex].name} mime · Objectif : ${targetPoints} points`;
    document.getElementById('scoreHint').textContent = finished ? 'Les scores de la partie' : 'Qui a trouvé ? Clique sur son nom pour lui donner un point.';
    document.getElementById('skipExpressionButton').hidden = finished;
    document.getElementById('newGameButton').hidden = !finished;
    playersContainer.replaceChildren();
    players.forEach((player, index) => {
        const button = document.createElement('button'); button.type = 'button';
        button.className = 'player'; button.disabled = finished || index === currentPlayerIndex;
        const name = document.createElement('span'); name.textContent = player.name;
        const score = document.createElement('strong'); score.textContent = `${player.score} / ${targetPoints}`;
        button.append(name, score);
        button.addEventListener('click', () => {
            if (finished) return;
            player.score++; currentPlayerIndex = index;
            finished = player.score >= targetPoints;
            gameExpressionContainer.textContent = finished ? `${player.name} a remporté la partie !` : pickExpression();
            renderPlayers();
        });
        playersContainer.append(button);
    });
}
document.getElementById('startButton').addEventListener('click', () => {
    if (!expressions.length) { alert('Aucune expression disponible pour démarrer.'); return; }
    players = Array.from(document.getElementsByClassName('playerInput')).map((input, index) => ({ name: input.value.trim() || `Joueur ${index + 1}`, score: 0 }));
    if (players.length < 2) return;
    targetPoints = Math.max(1, Math.min(100, Number.parseInt(document.getElementById('nbPoints').value, 10) || 5));
    finished = false; currentPlayerIndex = Math.floor(Math.random() * players.length);
    gameWindow.style.display = 'flex'; gameSettings.style.display = 'none';
    gameExpressionContainer.textContent = pickExpression(); renderPlayers();
    document.getElementById('gameModeContainer').scrollTop = 0;
});
document.getElementById('skipExpressionButton').addEventListener('click', () => {
    if (!finished) gameExpressionContainer.textContent = pickExpression();
});
function resetGame() {
    finished = true; players = [];
    gameExpressionContainer.textContent = ''; currentPlayerContainer.textContent = ''; playersContainer.replaceChildren();
    gameWindow.style.display = 'none'; gameSettings.style.display = 'block';
}
document.getElementById('newGameButton').addEventListener('click', resetGame);
window.addEventListener('expression-account-changed', resetGame);
