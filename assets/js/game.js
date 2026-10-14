var gameWindow = document.getElementById('gameWindow');
var gameSettings = document.getElementById('gameSettings');
const gameExpressionContainer = document.getElementById('gameExpressionContainer');
const currentPlayerContainer = document.getElementById('currentPlayerContainer');
const playersContainer = document.getElementById('playersContainer');
let players = [], currentPlayerIndex = 0, targetPoints = 5, finished = false;
function renderPlayers() {
    currentPlayerContainer.textContent = `${players[currentPlayerIndex].name} · ${players[currentPlayerIndex].score} / ${targetPoints}`;
    playersContainer.replaceChildren();
    players.forEach((player, index) => {
        if (index === currentPlayerIndex || finished) return;
        const button = document.createElement('button');
        button.className = 'player';
        button.textContent = `${player.name} · ${player.score} / ${targetPoints}`;
        button.addEventListener('click', () => {
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
    targetPoints = Math.max(1, Number.parseInt(document.getElementById('nbPoints').value, 10) || 5);
    finished = false; currentPlayerIndex = Math.floor(Math.random() * players.length);
    gameWindow.style.display = 'flex'; gameSettings.style.display = 'none';
    gameExpressionContainer.textContent = pickExpression(); renderPlayers();
});
