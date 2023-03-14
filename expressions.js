var expressions = [

    'Avoir le cul bordé de nouilles',
    'Mon cul sur la commode',
    'Avoir le cul entre deux chaises',
    'Tortiller du cul pour chier droit',
    'Se sortir les doigts du cul',

    'Croquer la vie à pleine dents',
    'Avoir les dents du fond qui baignent',
    'Mettre les pieds dans le plat',
    'Avoir la puce à l\'oreille',
    'Avoir les yeux plus gros que le ventre',
    'Avoir un poil dans la main',
    'Prendre ses jambes à son cou',

    'Tomber dans les pommes',
    'Raconter des salades',
    'Se fendre la poire',
    'Vouloir le beurre et l’argent du beurre',
    'Ne pas mettre tout ses oeufs dans le même panier',
    'On ne fait pas d\'omelette sans casser des oeufs',
    'Mettre de l\'huile sur le feu',

    'Copains comme cochon',
    'Mettre la charrue avant les bœufs',
    'Ça ne casse pas trois pattes à un canard',
    'Poser un lapin',
    'Faire le coq',
    'Il pleut comme vache qui pisse',
    'Se coucher à l\'heure les poules',
    'Être muet comme une carpe',
    'Prendre le taureau par les cornes',
    'Avoir une araignée au plafond',

    'Avoir un train de retard',
    'Pousser mémé dans les orties',
    'Cherche une aiguille dans une botte de foin',
    'Chercher midi à quatorze heures',
    'Y\'a pas de quoi en chier une pendule',

];

/////////////////////////////////////////////////////////////////////
//                GET EXPRESSIONS FROM NOTION DB                   //
/////////////////////////////////////////////////////////////////////

// response.results.forEach(function(item){
//     expressions.push(item.properties.Nom.title[0].plain_text)
//     console.log(item.properties.Nom.title[0].plain_text)
// });

notionExpressions = [];
const secretKey = "secret_6uURx5tlKpgue1jmTpC8JKJN9JW4d9OiAZnQhcKm67B"
const databaseId = "48e67affd6bb45568f9358efd0abd727"
// const databaseId = process.env.NOTION_DATABASE_ID

fetch('https://api.notion.com/v1/databases/48e67affd6bb45568f9358efd0abd727/query', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer secret_6uURx5tlKpgue1jmTpC8JKJN9JW4d9OiAZnQhcKm67B',
        'Notion-Version': '2022-06-28',
    },
    // body: JSON.stringify({ "id": 78912 })
})
.then(response => response.json())
.then(response => console.log(JSON.stringify(response)))

/////////////////////////////////////////////////////////////////////
//                      UPDATE EXPRESSION                          //
/////////////////////////////////////////////////////////////////////

var expressionContainer = document.getElementById('expressionContainer');
expressionContainer.innerHTML = updateExpression();

expressionContainer.addEventListener('click', function() {

    var expression = document.getElementById('expressionText');
    expression.classList.add('animate__fadeOutRightBig');
    
    expression.addEventListener('animationend', () => {
        var currentExpression = expressionContainer.innerHTML;
        var newExpression = updateExpression();
    
        while (currentExpression === newExpression) {
            newExpression = updateExpression();
        };
    
        expressionContainer.innerHTML = newExpression;
      });

});

function updateExpression() {
    
    var rand = Math.random() * expressions.length | 0;
    return '<h2 id="expressionText" class="animate__animated animate__fadeInLeftBig animate__faster">' + expressions[rand] + '</h2>';
};

/////////////////////////////////////////////////////////////////////
//                             MENU                                //
/////////////////////////////////////////////////////////////////////

var expressionsList = document.querySelector('#menu');

expressions.forEach(function(expression) {
    expressionsList.innerHTML += '<h2>' + expression + '</h2>';
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