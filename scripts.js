const totalPokemonNumber = 1302

function fetchPokemonList() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=' + totalPokemonNumber)
    .then(response => response.json())
    .then(function(pokemonNameList){
        storeIndividualObjectsFromArray(pokemonNameList.results);
    })
}

function storeIndividualObjectsFromArray(arr){

    let id = 1;
    
    arr.forEach(function(o) {
        let store = JSON.stringify(o);
        sessionStorage.setItem(id, store);
        id++;
    });
}

function addInitialPokemonToDOM() {

    let pokemonList = []
    for (let i = 1; i <= totalPokemonNumber; i++){
        pokemonList[i] = sessionStorage.getItem(i);
    }

    pokemonList.forEach(createPokemonCard);
    

}

function createPokemonCard (data){
    
    let pokemon = JSON.parse(data);
    const card = document.createElement("div");
    const pokemonName = document.createElement("h3");
    const pokemonNameText = document.createTextNode(removeDashes(pokemon.name));
    const collection = document.querySelector(".content");
    pokemonName.appendChild(pokemonNameText);
    card.appendChild(pokemonName);
    card.classList.add("card");
    card.setAttribute("id", pokemon.name);
    collection.appendChild(card);

    togglePokemonCardHidden(card);

}

function removeDashes(text){
    
    let formattedText = text.replace(/-/g," ");
    return formattedText;

}

function togglePokemonCardHidden (card) {
    card.classList.toggle("hidden");
}


if (sessionStorage.length === 0) {
    fetchPokemonList();
}

addInitialPokemonToDOM();

togglePokemonCardHidden(document.getElementById("charmander"));






