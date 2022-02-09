// console.log('Hello World');

document.addEventListener('DOMContentLoaded', function() {
    addEventListener('click', function() {
        document.querySelector('.center').innerHTML = 'label';

});
});

function getRandomCocktail () {
    //instead of the url here i actuailly need it to be "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + ingredient search
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        // console.log(data);
        displayRandomCocktail(data)
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

getRandomCocktail();

function displayRandomCocktail(cocktail) {
console.log(cocktail.drinks[0].strDrink);

let drinkSection = document.querySelector('#drink-section');

let drinkName = document.createElement('h2');
drinkName.innerHTML = cocktail.drinks[0].strDrink;

drinkSection.appendChild(drinkName);

let img = document.createElement('img');
img.src = cocktail.drinks[0].strDrinkThumb;

drinkSection.appendChild(img);

for(let i=1; i<16; i++) {
    // console.log(i)
//if there aren't any ingredients, don't display anything
    if (cocktail.drinks[0][`strIngredient${i}`] == null || cocktail.drinks[0][`strIngredient${i}`] == '') {
        break;
    }
    let drinkIngredient = document.createElement('ul');
    drinkIngredient.innerHTML = cocktail.drinks[0][`strIngredient${i}`] + ': ' + cocktail.drinks[0][`strMeasure${i}`];
    drinkSection.appendChild(drinkIngredient);
}

let instructions = document.createElement('p');
instructions.innerHTML = cocktail.drinks[0].strInstructions;
drinkSection.appendChild(instructions);

}

//newButton to refresh the page
let newButton = document.createElement('button');
newButton.innerHTML = 'New Cocktail';
newButton.addEventListener('click', function() {
    location.reload();
}
);
