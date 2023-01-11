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
    'Ne pas mettre tout ces oeufs dans le même panier',
    'On ne fait pas d\'omelette sans casser des oeufs',

    'Copains comme cochon',
    'Mettre la charrue avant les bœufs',
    'Ça ne casse pas trois pattes à un canard',
    'Poser un lapin',
    'Faire le coq',
    'Il pleut comme vache qui pisse',
    'Se coucher avec les poules',
    'Être muet comme une carpe',
    'Prendre le taureau par les cornes',
    'Avoir une araignée au plafond',

    'Avoir une train de retard',
    'Pousser mémé dans les orties',
    'Cherche une aiguille dans une botte de foin',
    'Chercher midi à quatorze heures',
    'Y\'a pas de quoi en chier une pendule',

];

var div = document.getElementById('expression');
div.innerHTML = updateExpression();

document.addEventListener('click', function() {

    var expression = document.getElementById('expressionText');
    console.log(expression);
    expression.classList.add('animate__fadeOutRightBig');
    
    expression.addEventListener('animationend', () => {
        var currentExpression = div.innerHTML;
        var newExpression = updateExpression();
    
        while (currentExpression === newExpression) {
            newExpression = updateExpression();
        };
    
        div.innerHTML = newExpression;
      });

});

function updateExpression() {
    
    var rand = Math.random() * expressions.length | 0;
    
    return '<h2 id="expressionText" class="animate__animated animate__fadeInLeftBig animate__faster">' + expressions[rand] + '</h2>';
};