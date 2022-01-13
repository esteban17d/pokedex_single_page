const API_URL = 'https://pokeapi.co/api/v2'

const pokemonContainer = document.querySelector("#pokemon_container");

let offset = 0;

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
        btnShowMore.classList.add("hide_element")
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
        btnShowMore.classList.add("hide_element")
    }

    if (!inputSearchPokemon.value) {
        pokemonContainer.innerHTML = "";
        btnShowMore.classList.remove("hide_element")
        getPokemons(0);
    }
} )
