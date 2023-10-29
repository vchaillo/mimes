var gameMode = document.getElementById('gameMode');
var gameWindow = document.getElementById('gameWindow');
var gameSettings = document.getElementById('gameSettings');
var gameExpressionContainer = document.getElementById('gameExpressionContainer');
var currentPlayerContainer = document.getElementById('currentPlayer');
var playersContainer = document.getElementById('playersContainer');

gameMode.addEventListener('click', function() {

    var gameModeContainer = document.getElementById('gameModeContainer');
    
    gameModeContainer.style.display = "flex";
    gameWindow.style.display = "none";
    gameSettings.style.display = "block";
    closeMenu();
});

var startButton = document.getElementById('startButton');

startButton.addEventListener('click', function() {

    gameWindow.style.display = "flex";
    gameSettings.style.display = "none";

    // 1. Récuperer les noms
    var players = document.getElementsByClassName('players');
    var nbPoints = document.getElementById('nbPoints');
    
    // 2. Choisir un nom random
    var random = Math.floor(Math.random() * ((players.length - 1) - 0 + 1) + 0);
    var random = Math.random() * players.length | 0;
    var currentPlayer = players.item(random);

    // 3. Afficher le nom
    console.log(currentPlayer.value);
    currentPlayerContainer.innerHTML = '<h3 id="currentPlayer" class="animate__animated animate__fadeInLeftBig animate__faster">' + currentPlayer.value + '</h3>';

    // 4. Choisir une expression random
    var random = Math.random() * expressions.length | 0;
    console.log(expressions[random]);
    
    // 5. Afficher l'expression
    gameExpressionContainer.innerHTML = '<h1 id="expressionText" class="animate__animated animate__fadeInLeftBig animate__faster">' + expressions[random] + '</h1>';

    // 6. Afficher le nom des joueurs
    playersHtml = '';
    for (player of players) {
        playersHtml += '<div>' + player.value + '</div>';
    }
    playersContainer.innerHTML = playersHtml;
});