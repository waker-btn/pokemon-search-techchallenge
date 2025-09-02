// Total number of Pokemon available in the API
const totalPokemonNumber = 1302;

// Only show first 151 Pokemon (Gen 1)
let viewablePokemonNumber = 151;

// Store the master Pokemon data
let masterPokemonNames;




//Add the initial batch of Pokemon cards to the DOM
async function addInitialPokemonToDOM() {

    try {
        // Ensure data is loaded (from API or sessionStorage)
        await initialise();

        // Retrieve stored Pokemon from sessionStorage
        let pokemonList = [];
        for (let i = 0; i < viewablePokemonNumber; i++) {
            pokemonList[i] = sessionStorage.getItem(i + 1);
        }

        // Remove loading message once data is ready
        const loadingMsg = document.getElementById("loading");
        if (loadingMsg) {
            loadingMsg.remove();
        };

        // Create a card for each Pokemon
        for (let i = 0; i < pokemonList.length; i++) {
            if (pokemonList[i]) {
                createPokemonCard(pokemonList[i]);
            }
        }
    } catch (error) {
        console.error("Failed to load Pokemon into DOM:", error);
        showErrorMessage("Failed to load Pokemon. Please refresh the page.");
    }
}

//Initialise the app by fetching data or use sessionStorage
async function initialise() {

    try {


        if (sessionStorage.getItem("master") === null) {
            // Fetch full list of Pokemon names
            masterPokemonNames = await fetchPokemonList();
            sessionStorage.setItem("master", JSON.stringify(masterPokemonNames));
        } else {
            // Load from sessionStorage
            masterPokemonNames = JSON.parse(sessionStorage.getItem("master"));
        }

        // If we don’t have detailed Pokemon info, fetch the first 151
        if (sessionStorage.getItem(1) === null) {
            const fetchAdditionalData = await fetchPokemonAdditionalData(masterPokemonNames.results.slice(0, viewablePokemonNumber));
            await storeIndividualObjectsFromArray(fetchAdditionalData);
        }
    } catch (error) {
        console.error("Error during initialise:", error);
        showErrorMessage("Could not initialise Pokemon data.");
    }
}



//Fetch the list of all Pokemon names
async function fetchPokemonList() {

    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=" + totalPokemonNumber);
        if (!response.ok) {
            throw new Error("Network not OK");
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch Pokémon list:", error);
        throw error;
    }
}


//Fetch additional data (images) for a list of Pokemon
async function fetchPokemonAdditionalData(arr) {

    const keyPath = "sprites.other.official-artwork.front_default";

    try {
        for (entry of arr) {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + entry.name);
            if (!response.ok) {
                throw new Error("Network not OK");
            }
            const pokemon = await response.json();

            //Set image path or fallback to empty string
            entry.imageURL = keyPath.split('.').reduce((previous, current) => previous[current], pokemon) || "";
        }

        return arr;

    } catch (error) {
        console.error("Failed to fetch additional Pokemon data:", error);
        throw error;
    }
}



//Store individual Pokemon data in sessionStorage
async function storeIndividualObjectsFromArray(arr) {

    let id = 1;

    arr.forEach(function (o) {
        try {
            let store = JSON.stringify(o);
            sessionStorage.setItem(id, store);
            id++;
        } catch (error) {
            console.error("Failed to store Pokemon:", o.name, error);
        }
    });

}



//Create a Pokemon card element and add it to the DOM

async function createPokemonCard(data) {

    try {
        let pokemon = JSON.parse(data);
        const card = document.createElement("div");
        const pokemonName = document.createElement("h3");
        const pokemonNameText = document.createTextNode(await removeDashes(pokemon.name));
        const collection = document.querySelector(".content");
        const sprite = document.createElement("img");
        sprite.src = pokemon.imageURL;

        pokemonName.appendChild(pokemonNameText);
        card.appendChild(sprite);
        card.appendChild(pokemonName);
        card.classList.add("card");
        card.setAttribute("id", pokemon.name);
        collection.appendChild(card);

    } catch (error) {
        console.error("Failed to create Pokemon card:", error);
    }
}


//Replace dashes in names with spaces
async function removeDashes(text) {

    let formattedText = text.replace(/-/g, " ");
    return formattedText;

}


//Hide a Pokemon card
async function changePokemonCardHidden(card) {
    card.classList.add("hidden");
}


//Show a Pokemon card
function changePokemonCardVisible(card) {
    card.classList.remove("hidden");
}


//Initialise the search input field
function initialiseSearchInput() {

    let searchBar = document.querySelector("input");
    searchBar.addEventListener("input", searchCards);

}


//Handle search queries to filter Pokemon cards
function searchCards(ev) {

    let search = document.querySelector("input").value;

    let allCards = document.querySelectorAll(".card");

    let displayed = 0;

    for (let i = 0; i < allCards.length; i++) {
        let reg = new RegExp(search, "i");
        if (allCards[i].id.search(reg) >= 0) {
            changePokemonCardVisible(allCards[i]);
            displayed++;
        } else {
            changePokemonCardHidden(allCards[i]);
        }
    }

    // Remove any existing "no results" message
    let findPara = document.querySelector("p");
    if (findPara !== null) {
        findPara.remove();
    }

    // If nothing matches, display a "no results" message
    if (displayed === 0) {
        const noResults = document.createElement("p");
        const noResultsText = document.createTextNode("No results match your search query.");
        const content = document.querySelector(".content");

        noResults.appendChild(noResultsText);
        content.appendChild(noResults);

    }
}


//Display an error message in the DOM
function showErrorMessage(message) {
    const content = document.querySelector(".content");
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.textContent = message;
    content.appendChild(errorMsg);
}


addInitialPokemonToDOM();
initialiseSearchInput();












