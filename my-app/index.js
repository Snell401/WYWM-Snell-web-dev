// console.log('Hello World');

/**
 * If you place your <script> tag at the end of the body, or if you
 * place it in the <head> tag, with the attribute `defer`, you can be
 * sure that your script will not run until the DOM content is loaded,
 * so you won't need to listen for a "DOMContentLoaded" event
 */
// document.addEventListener('DOMContentLoaded', function() {
/**
 * You need to apply the `addEventListener` method to an HTML element
 */
//     addEventListener('click', function() {
/**
 * I recommend using an `id` and `getElementById` rather than
 * `querySelector`, since this latter might not return the element
 * that you expect, if someone else rearranges your HTML
 */
//         document.querySelector('.center').innerHTML = 'label';
//
// });
// });

const title = document.getElementById("title");
const search = document.getElementById("findByIngredient");
const getRandom = document.getElementById("randomButton");
const drinkSection = document.getElementById("drink-section");

const randomURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const ingredientURL =
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=";



// RANDOM COCKTAIL // RANDOM COCKTAIL // RANDOM // RANDOM COCKTAIL //

function getRandomCocktail() {
  fetch(randomURL)
  .then(treatResponse)
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });

  function treatResponse(response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json()
    .then(replaceCurrentCocktail);
  }

  function replaceCurrentCocktail(data) {
    // Remove current children of drink section
    while (drinkSection.firstChild) {
      drinkSection.removeChild(drinkSection.lastChild);
    }

    // data will have the structure { drinks: Object[] }
    // Only one cocktail will be returned, so we simply choose the
    // first object in the drinks array
    displayCocktail(data.drinks[0]);
  }
}

getRandomCocktail();

// DISPLAY COCKTAIL // DISPLAY COCKTAIL / DISPLAY / DISPLAY COCKTAIL //

/**
 * Creates a set of DOM elements to insert into section#drink-section.
 * Example:
 * <section id="drink-section">
 *   <h2>Rum Cobbler</h2>
 *   <img src="https://www.thecocktaildb.com/images/...jpg">
 *   <ul>Sugar: 1 tsp superfine </ul>
 *   <ul>Club soda: 3 oz </ul>
 *   <ul>Lemon: 1 </ul>
 *   <ul>Dark rum: 2 oz </ul>
 *   <ul>Maraschino cherry: 1 </ul>
 *   <ul>Orange: 1 </ul>
 *   <p>In an old-fashioned glass... and lemon slices.</p>
 * </section>
 *
 * @param {Object} cocktail. For example:
 * {
 *   "idDrink": "17006",
 *   "strDrink": "Kool First Aid",
 *   "strDrinkAlternate": null,
 *   "strTags": null,
 *   "strVideo": null,
 *   "strCategory": "Shot",
 *   "strIBA": null,
 *   "strAlcoholic": "Alcoholic",
 *   "strGlass": "Shot glass",
 *   "strInstructions": "Add Kool Aid ... Slam and shoot.",
 *   "strInstructionsES": null,
 *   "strInstructionsDE": "Geben Sie Kool Aid... und Schuss.",
 *   "strInstructionsFR": null,
 *   "strInstructionsIT": "Aggiungi Kool-Aid... il rum.",
 *   "strInstructionsZH-HANS": null,
 *   "strInstructionsZH-HANT": null,
 *   "strDrinkThumb": "https://www.thecocktaildb.com/...jpg",
 *   "strIngredient1": "151 proof rum",
 *   "strIngredient2": "Kool-Aid",
 *   ...
 *   "strIngredient15": null,
 *   "strMeasure1": "2 oz light ",
 *   "strMeasure2": "1/2 tsp Tropical ",
 *   ...
 *   "strMeasure15": null,
 *   "strImageSource": null,
 *   "strImageAttribution": null,
 *   "strCreativeCommonsConfirmed": "No",
 *   "dateModified": "2017-08-24 09:53:44"
 * }
 */
function displayCocktail(cocktail) {
 // console.log("cocktail", JSON.stringify(cocktail, null, '  '));

  // Add an h2 title with the name of the cocktail
  const drinkName = document.createElement("h2");
  drinkName.innerHTML = cocktail.strDrink;
  drinkSection.appendChild(drinkName);

  // Add the image for the cocktail
  const img = document.createElement("img");
  img.src = cocktail.strDrinkThumb;
  drinkSection.appendChild(img);

  // Add <ul> for ingredients list
  const ul = document.createElement("ul")
  drinkSection.appendChild(ul)

  // Add <li> element for each ingredient
  for (let i = 1; i < 16; i++) {
    // If there aren't any more ingredients, the list is complete
    const ingredient = cocktail[`strIngredient${i}`]
    if (!ingredient) {
      break;
    }

    // Some ingredients like "egg" don't have any quanity, so we need
    // to account for that
    let quantity = cocktail[`strMeasure${i}`] || "";
    if (quantity) {
      quantity = ": " + quantity
    }
    const ingredientLI = document.createElement("li");
    ingredientLI.innerText = ingredient + quantity;

    ul.appendChild(ingredientLI);
  }

  let instructions = document.createElement("p");
  instructions.innerHTML = cocktail.strInstructions;
  drinkSection.appendChild(instructions);
}

/**
 * You would need to appendChild() this newButton element somewhere
 */
// //newButton to refresh the page
// let newButton = document.createElement("button");
// newButton.innerHTML = "New Cocktail";
// newButton.addEventListener("click", function () {
//   location.reload();
// });

getRandom.addEventListener("click", getRandomCocktail)
