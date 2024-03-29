var nbPoints = document.getElementById('nbPoints');
var minusPointsButton = document.getElementById('minusPointsButton');
var plusPointsButton = document.getElementById('plusPointsButton');

minusPointsButton.addEventListener('click', function() {

    nbPoints.value -= 1;
});

plusPointsButton.addEventListener('click', function() {
    
    nbPoints.value = parseInt(nbPoints.value) + 1;
});

var addPlayerButton = document.getElementById('addPlayerButton');

var nbPlayers = 2;
addPlayerButton.addEventListener('click', function() {
    
    var players = document.getElementsByClassName('playerInput');
    var playersForm = document.getElementById('playersForm');

    var playersFormHtml = '';
    for (player of players) {
        playersFormHtml += '<input class="playerInput" type="text" name="' + player.name + '" placeholder="' + player.placeholder + '" value="' + player.value + '"></input>';
    }

    nbPlayers++;
    playersFormHtml += '<input class="playerInput" type="text" name="player' + nbPlayers + '" placeholder="Joueur ' + nbPlayers + '"></input>';
    
    playersForm.innerHTML = playersFormHtml;
    // console.log(playersForm);
});
