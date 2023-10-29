/////////////////////////////////////////////////////////////////////
//                             MENU                                //
/////////////////////////////////////////////////////////////////////

function closeMenu() {
    var menu = document.querySelector('#menuContainer');

    menuOpen = false;
    menu.classList.add("animate__slideOutLeft");
    menu.classList.remove("animate__slideInLeft");
}

var expressionsList = document.querySelector('#menuContainer');

// expressions.forEach(function(expression) {
//     expressionsList.innerHTML += '<p class="expressions animate__animated">' + expression + '</p>';
// });

var openMenuButton = document.querySelector('#openMenuButton');

openMenuButton.addEventListener('click', function() {

    var menu = document.querySelector('#menuContainer');

    menuOpen = true;
    menu.style.display = "flex";
    menu.classList.add("animate__slideInLeft");
    menu.classList.remove("animate__slideOutLeft");
});


var closeMenuButton = document.querySelector('#closeMenuButton');

closeMenuButton.addEventListener('click', closeMenu);

// var expressionContainer = document.querySelector('#expressionContainer');
// expressionContainer.addEventListener('click', closeMenu());

document.addEventListener("keyup", function(e) {
    
    if (e.key === "Escape") {
        closeMenu();
    }
});


// var expressionListArrow = document.querySelector('#expressionList');

// expressionListArrow.addEventListener('click', function() {

//     var expressions = document.querySelector('.expressions');

//     console.log(expressions);
//     expressions.classList.add("animate__slideOutLeft");
//     // expressions.classList.remove("animate__slideInLeft");
// });