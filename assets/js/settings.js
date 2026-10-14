const nbPoints = document.getElementById('nbPoints');
const playersForm = document.getElementById('playersForm');
function normalizePoints() {
    nbPoints.value = Math.max(1, Math.min(100, Number.parseInt(nbPoints.value, 10) || 5));
}
nbPoints.addEventListener('change', normalizePoints);
document.getElementById('minusPointsButton').addEventListener('click', () => {
    normalizePoints(); nbPoints.value = Math.max(1, Number(nbPoints.value) - 1);
});
document.getElementById('plusPointsButton').addEventListener('click', () => {
    normalizePoints(); nbPoints.value = Math.min(100, Number(nbPoints.value) + 1);
});
function updatePlayerLabels() {
    const rows = Array.from(playersForm.children);
    rows.forEach((row, index) => {
        const input = row.querySelector('input');
        input.name = `player${index + 1}`;
        input.placeholder = `Joueur ${index + 1}`;
        input.setAttribute('aria-label', `Nom du joueur ${index + 1}`);
        row.querySelector('.playerNumber').textContent = String(index + 1).padStart(2, '0');
        const button = row.querySelector('button');
        button.disabled = rows.length <= 2;
        button.setAttribute('aria-label', `Retirer le joueur ${index + 1}`);
    });
    document.getElementById('playerCount').textContent = `${rows.length} joueurs`;
}
function addPlayer() {
    const row = document.createElement('div'); row.className = 'playerRow';
    const number = document.createElement('span'); number.className = 'playerNumber';
    const input = document.createElement('input'); input.type = 'text';
    input.className = 'playerInput'; input.maxLength = 40; input.autocomplete = 'off';
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'circleButton';
    const icon = document.createElement('i'); icon.className = 'fa-solid fa-minus'; icon.setAttribute('aria-hidden', 'true');
    remove.append(icon);
    remove.addEventListener('click', () => {
        if (playersForm.children.length <= 2) return;
        row.remove(); updatePlayerLabels();
    });
    row.append(number, input, remove); playersForm.append(row); updatePlayerLabels();
    return input;
}
addPlayer(); addPlayer();
document.getElementById('addPlayerButton').addEventListener('click', () => { addPlayer().focus(); });
