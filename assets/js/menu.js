/////////////////////////////////////////////////////////////////////
//                             MENU                                //
/////////////////////////////////////////////////////////////////////

function closeMenu() {
    var menu = document.querySelector('#menuContainer');

    menuContainer.classList.add("animate__slideOutLeft");
    menuContainer.classList.remove("animate__slideInLeft");
}

var openMenuButton = document.querySelector('#openMenuButton');
openMenuButton.addEventListener('click', function() {

    var menuContainer = document.querySelector('#menuContainer');

    menuContainer.style.display = "flex";
    menuContainer.classList.add("animate__slideInLeft");
    menuContainer.classList.remove("animate__slideOutLeft");
});


var closeMenuButton = document.querySelector('#closeMenuButton');
closeMenuButton.addEventListener('click', closeMenu);

document.addEventListener("keyup", function(e) {
    
    if (e.key === "Escape") {
        closeMenu();
    }
});

var gameMode = document.getElementById('gameMode');
var gameWindow = document.getElementById('gameWindow');
var gameSettings = document.getElementById('gameSettings');
gameMode.addEventListener('click', function() {

    var gameModeContainer = document.getElementById('gameModeContainer');
    
    gameModeContainer.style.display = "flex";
    gameWindow.style.display = "none";
    gameSettings.style.display = "block";
    gameModeContainer.classList.add("animate__slideInRight");
    gameModeContainer.classList.remove("animate__slideOutRight");
    closeMenu();
});

var freeMode = document.getElementById('freeMode');
freeMode.addEventListener('click', function() {

    var gameModeContainer = document.getElementById('gameModeContainer');
    
    gameModeContainer.style.display = "none";
    gameWindow.style.display = "none";
    gameSettings.style.display = "none";
    closeMenu();
});