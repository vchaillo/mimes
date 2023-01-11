var expressions = [

    'Avoir le cul bordé de nouilles',
    'Mon cul sur la commode',
    'Avoir le cul entre deux chaises',
    'Tortiller du cul pour chier droit',
    'Se sortir les doigts du cul',

    'Mettre la charrue avant les bœufs',
    'Croquer la vie à pleine dents',
    'Avoir les dents du fond qui baignent',
    'Mettre les pieds dans le plat',
    'Pousser mémé dans les orties',

    'Ça ne casse pas trois pattes à un canard',
    'Tomber dans les pommes',
    'Copains comme cochon',
    'Raconter des salades',

    'Il pleut comme vache qui pisse',
    'Prendre ses jambes à son cou',
    'Vouloir le beurre et l’argent du beurre',
    'Être muet comme une carpe',
    'Prendre le taureau par les cornes',

];

var div = document.getElementById('expression');
div.innerHTML = updateExpression();

document.addEventListener('click', function() {
    
    var currentExpression = div.innerHTML;
    var newExpression = updateExpression();

    while (currentExpression === newExpression) {
        newExpression = updateExpression();
    };

    div.innerHTML = newExpression;
});

function updateExpression() {
    
    var rand = Math.random() * expressions.length | 0;
    
    return '<h2 class="animate__animated animate__rotateIn">' + expressions[rand] + '</h2>';
};