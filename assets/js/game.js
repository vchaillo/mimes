var gameWindow = document.getElementById('gameWindow');
var gameSettings = document.getElementById('gameSettings');
var gameExpressionContainer = document.getElementById('gameExpressionContainer');
var currentPlayerContainer = document.getElementById('currentPlayer');
var playersContainer = document.getElementById('playersContainer');

var startButton = document.getElementById('startButton');

startButton.addEventListener('click', function() {

    gameWindow.style.display = "flex";
    gameSettings.style.display = "none";

    // Init Game's variables with players, points and time
    // initGame();
    // startGame();

    // Choisir une expression random
    var random = Math.random() * expressions.length | 0;
    
    // Afficher l'expression
    gameExpressionContainer.innerHTML = '<h1 id="expressionText">' + expressions[random] + '</h1>';

    // Récuperer les noms des joueurs
    var playersInputs = document.getElementsByClassName('playerInput');
    var nbPoints = document.getElementById('nbPoints');
    
    // Choisir un nom random
    var random = Math.floor(Math.random() * ((playersInputs.length - 1) - 0 + 1) + 0);
    var random = Math.random() * playersInputs.length | 0;
    var currentPlayer = playersInputs.item(random);

    // Afficher le nom du joueur en cours
    currentPlayerContainer.innerHTML = '<h3 id="currentPlayer">' + currentPlayer.value + '<br>0 /' + nbPoints.value + '</h3>';

    // Afficher le nom des autres joueurs
    var playersHtml = '';
    for (player of playersInputs) {
        if (player != currentPlayer) {
            playersHtml += '<div class="player" id="' + player.name + '" name="' + player.value + '" score="0">' + player.value + '<br>0 /' + nbPoints.value + '</div>';
        }
    }
    playersContainer.innerHTML = playersHtml;

    startGame(nbPoints.value);
});

function startGame(nbPoints) {

    var playersHtml = document.getElementsByClassName('player');

    for (playerHtml of playersHtml) {
        
        playerHtml.addEventListener('click', function(e) {
            playerHtml = e.target;

            // Augmenter le score du joueur
            playerHtml.setAttribute('score', parseInt(playerHtml.getAttribute('score')) + 1);
            var playerDiv = document.getElementById(playerHtml.id);
            playerDiv.innerHTML = playerHtml.getAttribute('name') + '<br>' + playerHtml.getAttribute('score') +' /' + nbPoints;

            // Vérifier si le score maximal est attein par le joueur
            if (playerHtml.getAttribute('score') == nbPoints) {
                alert(playerHtml.getAttribute('name') + " a remporté la partie !");
            }

            // Afficher le nom du joueur comme currentJoueur
            // Afficher une nouvelle expression
        });
    }
}