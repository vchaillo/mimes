/////////////////////////////////////////////////////////////////////
//                             MENU                                //
/////////////////////////////////////////////////////////////////////

var expressionsList = document.querySelector('#menu');

expressions.forEach(function(expression) {
    expressionsList.innerHTML += '<p class="expressions animate__animated">' + expression + '</p>';
});


var openMenuButton = document.querySelector('#openMenuButton');

openMenuButton.addEventListener('click', function() {

    var menu = document.querySelector('#menu');

    menu.style.display = "block";
    menu.classList.add("animate__slideInLeft");
    menu.classList.remove("animate__slideOutLeft");
});


var closeMenuButton = document.querySelector('#closeMenuButton');

closeMenuButton.addEventListener('click', function() {

    var menu = document.querySelector('#menu');

    menu.classList.add("animate__slideOutLeft");
    menu.classList.remove("animate__slideInLeft");
});

var expressionContainer = document.querySelector('#expressionContainer');

expressionContainer.addEventListener('click', function() {

    var menu = document.querySelector('#menu');

    menu.classList.add("animate__slideOutLeft");
    menu.classList.remove("animate__slideInLeft");
});

document.addEventListener("keyup", function(e) {
    
    if (e.key === "Escape") {
        var menu = document.querySelector('#menu');

        menu.classList.add("animate__slideOutLeft");
        menu.classList.remove("animate__slideInLeft");
    }
});

// var expressionListArrow = document.querySelector('#expressionList');

// expressionListArrow.addEventListener('click', function() {

//     var expressions = document.querySelector('.expressions');

//     console.log(expressions);
//     expressions.classList.add("animate__slideOutLeft");
//     // expressions.classList.remove("animate__slideInLeft");
// });