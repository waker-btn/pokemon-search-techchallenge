const totalPokemonNumber = 1302;
let viewablePokemonNumber = 151;
let masterPokemonNames;
let itemsPerPage = 18;
let currentPage = 1;



async function addInitialPokemonToDOM() {

    const initial = await initialise();

    let pokemonList = []
    for (let i = 0; i < viewablePokemonNumber; i++) {
        pokemonList[i] = sessionStorage.getItem(i + 1);
    }


    for (let i = 0; i < pokemonList.length; i++) {
        createPokemonCard(pokemonList[i]);
    }
}

async function initialise() {


    if (sessionStorage.getItem("master") === null) {
        masterPokemonNames = await fetchPokemonList();
        sessionStorage.setItem("master", JSON.stringify(masterPokemonNames));
    } else {
        masterPokemonNames = JSON.parse(sessionStorage.getItem("master"));
    }

    if (sessionStorage.getItem(1) === null) {
        const fetchAdditionalData = await fetchPokemonAdditionalData(masterPokemonNames.results.slice(0, viewablePokemonNumber))
        const storeNames = await storeIndividualObjectsFromArray(fetchAdditionalData);
    }

}



async function fetchPokemonList() {

    const pokeFetch = await fetch('https://pokeapi.co/api/v2/pokemon?limit=' + totalPokemonNumber);
    const allPokemonList = await pokeFetch.json();
    return allPokemonList;
}

async function fetchPokemonAdditionalData(arr) {

    const keyPath = "sprites.other.official-artwork.front_default";

    for (entry of arr) {
        const pokeFetch = await fetch('https://pokeapi.co/api/v2/pokemon/' + entry.name);
        const pokemon = await pokeFetch.json();
        entry.imageURL = keyPath.split('.').reduce((previous, current) => previous[current], pokemon);
    }

    return arr;

}

async function storeIndividualObjectsFromArray(arr) {

    let id = 1;

    arr.forEach(function (o) {
        let store = JSON.stringify(o);
        sessionStorage.setItem(id, store);
        id++;
    });

}

async function createPokemonCard(data) {

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

}

async function removeDashes(text) {

    let formattedText = text.replace(/-/g, " ");
    return formattedText;

}

async function changePokemonCardHidden(card) {
    card.classList.add("hidden");
}

function changePokemonCardVisible(card) {
    card.classList.remove("hidden");
}

function initialiseSearchInput() {

    let searchBar = document.querySelector("input");
    searchBar.addEventListener("input", searchCards);

}

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

    let findPara = document.querySelector("p");

    if (findPara !== null){
        findPara.remove();
    }

    if (displayed === 0) {
        const noResults = document.createElement("p");
        const noResultsText = document.createTextNode("No results match your search query.");
        const content = document.querySelector(".content");

        noResults.appendChild(noResultsText);
        content.appendChild(noResults);

    }
}








addInitialPokemonToDOM();
initialiseSearchInput();












