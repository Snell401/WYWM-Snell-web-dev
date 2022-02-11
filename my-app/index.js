const title = document.getElementById("title");
const search = document.getElementById("findByIngredient");
const ingredient = document.getElementById("cocktailIngredient");
const getRandom = document.getElementById("randomButton");
const drinkSection = document.getElementById("drink-section");

const randomURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const ingredientURL =
  "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";
const idURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="



// UTILITY FUNCTIONS // UTILITY FUNCTIONS // UTILITY FUNCTIONS //

function checkStatus(response) {
  if (response.status !== 200) {
    throw new Error(`Status error: ${response.status}`)

  } else {
    return response.json()
  }
}


function clearBar() {
  // Remove current children of drink section
  while (drinkSection.firstChild) {
    drinkSection.removeChild(drinkSection.lastChild);
  }
}


function addCocktail(data) {
  // data will have the structure { drinks: Object[] }
  // Only one cocktail will be present, so we simply choose the
  // first object in the drinks array
  displayCocktail(data.drinks[0]);
}



// RANDOM COCKTAIL // RANDOM COCKTAIL // RANDOM // RANDOM COCKTAIL //

function getRandomCocktail() {
  fetch(randomURL)
  .then(checkStatus)
  .then(replaceCurrentCocktail)
  .catch(function (err) {
    console.log("Fetch Error:", err);
  });

  function replaceCurrentCocktail(data) {
    clearBar()
    addCocktail(data)
  }
}



// FIND BY INGREDIENT // FIND BY INGREDIENT // FIND BY INGREDIENT //

function findByIngredient() {
  const chosenIngredient = ingredient.value
  if (!chosenIngredient) {
    return
  } else if (chosenIngredient.indexOf(",") > -1) {
    // You need to be a $2+ Patreon supporter to search for
    // multi-ingredients
    return
  }

  const searchURL = `${ingredientURL}${chosenIngredient}`
  // console.log("searchURL", searchURL);

  fetch(searchURL)
  .then(checkStatus)
  .then(replaceCurrentCocktails)
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });

  /**
   *
   * @param {Object} data has the format:
   * { "drinks": [
   *     {
   *       "strDrink": "Brandy Flip",
   *       "strDrinkThumb": "https://www.thecocktaildb.com/images/...jpg",
   *       "idDrink": "11164"
   *     },
   *     ...
   *   ]
   * }
   */
  function replaceCurrentCocktails(data) {
    // console.log("data", JSON.stringify(data, null, '  '));
    clearBar()
    data.drinks.forEach(getCocktailById);
  }

  /**
   *
   * @param {Object} cocktailData
   * {
   *    "strDrink": "Brandy Flip",
   *    "strDrinkThumb": "https://www.thecocktaildb.com/images/...jpg",
   *    "idDrink": "11164"
   *  }
   */
  function getCocktailById(cocktailData) {
    const id = cocktailData.idDrink
    const searchURL = `${idURL}${id}`

    fetch(searchURL)
    .then(checkStatus)
    .then(addCocktail)
    .catch(error => console.log("Error in getCocktailById", error));
  }
}



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


// KEYBOARD SHORTCUT // KEYBOARD SHORTCUT // KEYBOARD SHORTCUT //

function checkForEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault()
    findByIngredient()
  }
}

// Activate the buttons
search.addEventListener("click", findByIngredient)
ingredient.addEventListener("keyup", checkForEnter)
getRandom.addEventListener("click", getRandomCocktail)


// Open the page with a random cocktail by default
getRandomCocktail();
