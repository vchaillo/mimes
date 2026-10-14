const nbPoints = document.getElementById('nbPoints');
nbPoints.min = '1';
document.getElementById('minusPointsButton').addEventListener('click', () => {
    nbPoints.value = Math.max(1, (Number.parseInt(nbPoints.value, 10) || 1) - 1);
});
document.getElementById('plusPointsButton').addEventListener('click', () => {
    nbPoints.value = (Number.parseInt(nbPoints.value, 10) || 1) + 1;
});
document.getElementById('addPlayerButton').addEventListener('click', () => {
    const number = document.getElementsByClassName('playerInput').length + 1;
    const input = document.createElement('input');
    input.className = 'playerInput'; input.type = 'text';
    input.name = `player${number}`; input.placeholder = `Joueur ${number}`;
    document.getElementById('playersForm').append(input);
});
