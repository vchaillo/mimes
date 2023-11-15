var gameWindow = document.getElementById('gameWindow');
var gameSettings = document.getElementById('gameSettings');
var gameExpressionContainer = document.getElementById('gameExpressionContainer');
var currentPlayerContainer = document.getElementById('currentPlayerContainer');
var playersContainer = document.getElementById('playersContainer');

var startButton = document.getElementById('startButton');

startButton.addEventListener('click', function() {

    gameWindow.style.display = "flex";
    gameSettings.style.display = "none";

    // Init Game's variables with players, points and time
    gameDatas = initGame();
    
    console.log(gameDatas);

    while (gameDatas['finished'] === false) {
        game(gameDatas);
    }
    
    alert(gameDatas['winner'].getAttribute('name') + " a remporté la partie !");
    // console.log(gameDatas);
});

function initGame() {
    // Choisir une expression random
    var random = Math.random() * expressions.length | 0;

    // Afficher l'expression
    gameExpressionContainer.innerHTML = '<h1 id="expressionText">' + expressions[random] + '</h1>';

    // Récuperer les noms des joueurs et les points
    var playersInputs = document.getElementsByClassName('playerInput');
    var nbPoints = document.getElementById('nbPoints');

    // Choisir un nom random pour le current player
    // var random = Math.floor(Math.random() * ((playersInputs.length - 1) - 0 + 1) + 0);
    var currentPlayer = playersInputs.item(Math.random() * playersInputs.length | 0);

    // Afficher le nom du joueur en cours
    currentPlayerContainer.innerHTML = '<h3 id="currentPlayer" class="player" name="' + currentPlayer.value + '" score="0">' + currentPlayer.value + '<br>0 /' + nbPoints.value + '</h3>';

    // Afficher le nom des autres joueurs
    var playersHtml = '';
    for (player of playersInputs) {
        if (player != currentPlayer) {
            playersHtml += '<div class="player" id="' + player.name + '" name="' + player.value + '" score="0">' + player.value + '<br>0 /' + nbPoints.value + '</div>';
        }
    }
    playersContainer.innerHTML = playersHtml;

    playersHtml = document.getElementsByClassName('player');

    var gameDatas = {
        'nbPoints' :  nbPoints.value,
        'currentPlayer' : currentPlayer,
        'players' : playersHtml,
        'winner': null,
        'finished': false,
    }

    return gameDatas;
}

function game(gameDatas) {

    for (playerHtml of gameDatas['players']) {
        
        if (playerHtml != gameDatas['currentPlayer']) {
            playerHtml.addEventListener('click', function(e) {
                playerHtml = e.target;

                // Augmenter le score du joueur
                playerHtml.setAttribute('score', parseInt(playerHtml.getAttribute('score')) + 1);
                var playerDiv = document.getElementById(playerHtml.id);
                playerDiv.innerHTML = playerHtml.getAttribute('name') + '<br>' + playerHtml.getAttribute('score') +' /' + gameDatas['nbPoints'];

                // Vérifier si le score maximal est attein par le joueur
                if (playerHtml.getAttribute('score') == gameDatas['nbPoints']) {
                    gameDatas['finished'] = true;
                    gameDatas['winner'] = playerHtml;
                }

                // Afficher le nom du joueur comme currentJoueur
                currentPlayerContainer.innerHTML = '<h3 id="currentPlayer" class="player" name="' + playerHtml.getAttribute('name') + '" score="0">' + playerHtml.getAttribute('name') + '<br>' + playerHtml.getAttribute('score') +' /' + gameDatas['nbPoints'] + '</h3>';
                gameDatas['currentPlayer'] = playerHtml;

                // Reconstruire la liste des joueurs
                var playersHtml = '';
                for (player of gameDatas['players']) {
                    if (player != gameDatas['currentPlayer']) {
                        console.log(player);
                        playersHtml += '<div class="player" id="' + player.getAttribute('name') + '" name="' + player.getAttribute('name') + '" score="' + player.getAttribute('score') + '">' + player.getAttribute('name') +'<br>' + player.getAttribute('score') + ' /' + gameDatas['nbPoints'] + '</div>';
                    }
                }
                playersContainer.innerHTML = playersHtml;
                gameDatas['players'] = document.getElementsByClassName('player');

                // Afficher une nouvelle expression
                log(gameDatas);
            });
        }
    }
}

