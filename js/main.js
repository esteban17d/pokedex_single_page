const API_URL = 'https://pokeapi.co/api/v2'

const pokemonContainer = document.querySelector("#pokemon_container");

let offset = 0;
let offsetAlt = 0;
let sortBy = "";
let sortByDir = "";

const btnShowMore = document.querySelector('#btn_show_more')
btnShowMore.addEventListener('click', function () {
    offset = offset + 20;
    getPokemons(offset);
})

const renderPokemon = (pokemon) => {
    const pokemonItem = document.createElement('div')
    pokemonItem.classList.add("pokemon_item")

    const pokemonTypes = document.createElement('div')
    pokemonTypes.classList.add("pokemon_types")

    const pokemonStats = document.createElement('div') 
    pokemonStats.classList.add("pokemon_stats")

    let pokemonNumber = pokemon.id;

    if (pokemonNumber < 100) {
        pokemonNumber = "0" + pokemon.id
    }

    if (pokemonNumber < 10) {
            pokemonNumber = "00" + pokemon.id
    }

    pokemonItem.innerHTML += `
        <img class="pokemon_sprite" src="${pokemon.sprites.front_default}" />
        <h3 class="pokemon_name">${pokemon.name}</h3><p class="pokemon_number">#${pokemonNumber}</p>
    `

    for (var j = 0; j < pokemon.types.length; j++) {
        const pokemonType = document.createElement('p')
        pokemonType.classList.add('pokemon_type')
        pokemonType.classList.add(`pokemon_type_${pokemon.types[j].type.name}`)
        pokemonType.innerHTML += `
            ${pokemon.types[j].type.name}
        `
        pokemonTypes.appendChild(pokemonType)
    }

    for (var j = 0; j < pokemon.stats.length; j++) {
        pokemonStats.innerHTML += `
            <p><span class="pokemon_stat_title">${pokemon.stats[j].stat.name}:</span> ${pokemon.stats[j].base_stat}</p>
        `
    }
    pokemonItem.appendChild(pokemonTypes)
    pokemonItem.appendChild(pokemonStats)
    pokemonContainer.appendChild(pokemonItem)
}

const showPokemons = async (pokemons) => {
    for (var i = 0; i < pokemons.results.length; i++) {
        let res_inv = await fetch(`${API_URL}/pokemon/${pokemons.results[i].name}`)
        const pokemon = await res_inv.json()
        renderPokemon(pokemon);
    }
}

const getPokemons = async (offset) => {
    let res = await fetch(`${API_URL}/pokemon?offset=${offset}&limit=20`)
    const pokemons = await res.json()
    showPokemons(pokemons);
    if ((pokemons.count - offset) < 20) {
        if (!btnShowMore.classList.contains("hide_element")) {
            btnShowMore.classList.add("hide_element")
        }
    }
}

getPokemons(offset);

const btnSearchPokemon = document.querySelector('#btn_search_pokemon')
const inputSearchPokemon = document.querySelector('#input_search_pokemon')
btnSearchPokemon.addEventListener('click', function () {
    let inputSearchPokemonValue = inputSearchPokemon.value.toLowerCase().trim();

    if (inputSearchPokemon.value.includes('#')) {
        inputSearchPokemonValue = inputSearchPokemon.value.replace(/#/g, "")
    }

    if (!isNaN(inputSearchPokemonValue)) {
        inputSearchPokemonValue = parseInt(inputSearchPokemonValue)  
    }

    if (inputSearchPokemon.value) {
        fetch(`${API_URL}/pokemon/${inputSearchPokemonValue}`)
            .then(res => res.json())
            .then((pokemon) => {
                pokemonContainer.innerHTML = "";
                renderPokemon(pokemon);
            })
            .catch(function(err){
                pokemonContainer.innerHTML = `<p class="not_found_p">No se ha encontrado el pokemon</p>`;
            })
        if (!btnShowMore.classList.contains("hide_element")) {
            btnShowMore.classList.add("hide_element")
        }
    }

    if (!inputSearchPokemon.value) {
        pokemonContainer.innerHTML = "";
        if (btnShowMore.classList.contains('hide_element')) {
            btnShowMore.classList.remove("hide_element")
        }
        getPokemons(0);
    }
} )

const btnDropdown = document.querySelector("#dropdown_button")
const itemsContainerDropdown = document.querySelector("#dropdown_items_container")
btnDropdown.addEventListener("click", function() {
    itemsContainerDropdown.classList.toggle('dropdown_items_container_show')
})

const quicksortMethod = (data, sortBy, direction) => {

    if (data.length < 1) {
        return [];
    }

    let subArrayLeft = [];
    let subArrayRight = [];
    let pivot = data[0];

    if (sortBy == "name") {
        for (let x = 1; x < data.length; x++){
            if (direction == "asc") {
                if (data[x].name > pivot.name) {
                    subArrayRight.push(data[x]);
                }
                else {
                    subArrayLeft.push(data[x]);
                }
            }

            if (direction == "des") {
                if (data[x].name < pivot.name) {
                    subArrayRight.push(data[x]);
                }
                else {
                    subArrayLeft.push(data[x]);
                }
            }
        }
    }

    if (sortBy == "num") {
        for (let x = 1; x < data.length; x++){
            if (direction == "des") {
                if (parseInt(data[x].id) < parseInt(pivot.id)) {
                    subArrayRight.push(data[x]);
                }
                else {
                    subArrayLeft.push(data[x]);
                }
            }
        }
    }
    return [].concat(quicksortMethod(subArrayLeft, sortBy, direction), pivot, quicksortMethod(subArrayRight, sortBy, direction));
}    

const showPokemonsAlt = async (dataSort, offset) => {
    for (var i = offset; i < offset + 20; i++) {
        let res_ind = await fetch(`${API_URL}/pokemon/${dataSort[i].name}`)
        const data = await res_ind.json()
        renderPokemon(data)
    }
}

const getPokemonsSort = async (sortBy, direction) => {
    let res = await fetch(`${API_URL}/pokemon?offset=0&limit=2000`)
    const data = await res.json()
    let dataNoSort = data.results
    let dataSort = quicksortMethod(dataNoSort, sortBy, direction);
    console.log(dataSort)
    console.log(dataSort.length - offsetAlt)
    showPokemonsAlt(dataSort, offsetAlt);
    if ((dataSort.length - offsetAlt) < 20) {
        btnShowMoreAlt.classList.add("hide_element")
    }
    offsetAlt = offsetAlt + 20
}

const btnShowMoreAlt = document.querySelector('#btn_show_more_alt')
btnShowMoreAlt.addEventListener('click', function () {
    getPokemonsSort(sortBy, sortByDir);
})


const btnSortByNameAsc = document.querySelector("#btn_sort_by_name_asc")
btnSortByNameAsc.addEventListener("click", async function() {
    offsetAlt = 0;
    offset = 0;
    sortBy = "name"
    sortByDir = "asc";
    if (!btnShowMore.classList.contains("hide_element")) {
        btnShowMore.classList.add("hide_element")
    }
    if (btnShowMoreAlt.classList.contains("hide_element")) {
        btnShowMoreAlt.classList.remove("hide_element")
    }
    pokemonContainer.innerHTML = "";
    getPokemonsSort(sortBy, sortByDir);
})

const btnSortByNameDes = document.querySelector("#btn_sort_by_name_des")
btnSortByNameDes.addEventListener("click", async function() {
    offsetAlt = 0;
    offset = 0;
    sortBy = "name"
    sortByDir = "des";
    if (!btnShowMore.classList.contains("hide_element")) {
        btnShowMore.classList.add("hide_element")
    }
    if (btnShowMoreAlt.classList.contains("hide_element")) {
        btnShowMoreAlt.classList.remove("hide_element")
    }
    pokemonContainer.innerHTML = "";
    getPokemonsSort(sortBy, sortByDir);
})

const btnSortByNumAsc = document.querySelector("#btn_sort_by_num_asc")
btnSortByNumAsc.addEventListener("click", async function() {
    offsetAlt = 0;
    offset = 0;
    pokemonContainer.innerHTML = "";
    getPokemons(offset);
})

const btnSortByNumDes = document.querySelector("#btn_sort_by_num_des")
btnSortByNumDes.addEventListener("click", async function() {
    offsetAlt = 0;
    offset = 0;
    sortBy = "num"
    sortByDir = "des";
    if (!btnShowMore.classList.contains("hide_element")) {
        btnShowMore.classList.add("hide_element")
    }
    if (btnShowMoreAlt.classList.contains("hide_element")) {
        btnShowMoreAlt.classList.remove("hide_element")
    }
    pokemonContainer.innerHTML = "";
    getPokemonsSort(sortBy, sortByDir);
})

