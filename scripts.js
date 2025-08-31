const totalPokemonNumber = 1302;
let viewablePokemonNumber = 151;
let masterPokemonNames;

async function addInitialPokemonToDOM() {

    const initial = await initialise();

    const fetchAdditionalData = await fetchPokemonAdditionalData(masterPokemonNames.results.slice(0, viewablePokemonNumber))

    const storeNames = await storeIndividualObjectsFromArray(fetchAdditionalData);



    let pokemonList = []
    for (let i = 1; i <= totalPokemonNumber; i++) {
        pokemonList[i] = sessionStorage.getItem(i);
    }

    pokemonList.forEach(createPokemonCard);


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
    const pokemonNameText = document.createTextNode( await removeDashes(pokemon.name));
    const collection = document.querySelector(".content");
    pokemonName.appendChild(pokemonNameText);
    card.appendChild(pokemonName);
    card.classList.add("card");
    card.setAttribute("id", pokemon.name);
    collection.appendChild(card);

    /**togglePokemonCardHidden(card);**/

}

async function removeDashes(text) {

    let formattedText = text.replace(/-/g, " ");
    return formattedText;

}

async function togglePokemonCardHidden(card) {
    card.classList.toggle("hidden");
}

async function initialise(){

    if (sessionStorage.getItem("master") === null) {
    masterPokemonNames = await fetchPokemonList();
    sessionStorage.setItem("master", JSON.stringify(masterPokemonNames));
} else {
    masterPokemonNames = JSON.parse(sessionStorage.getItem("master"));
}
}

addInitialPokemonToDOM();












