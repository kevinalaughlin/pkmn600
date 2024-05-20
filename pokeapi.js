// Pokémon data object
let pokemon = {
    id: 0,
    types: [],
    img: "",
    stats: {
        hp: 0,
        atk: 0,
        def: 0,
        spAtk: 0,
        spDef: 0,
        spd: 0
    },
    primaryType: "",
    secondaryType: ""
};

let species = {
    name: "",
    generation: ""
};

let canEvolve = false;
let evolvedID = 0;

async function getPokeAPIStats(num) {
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${num}`;
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();

    const url = `https://pokeapi.co/api/v2/pokemon/${num}`;
    const res = await fetch(url);
    const data = await res.json();

    species.name = speciesData.name;
    species.generation = speciesData.generation.name;
    pokemon.id = data.id;
    pokemon.types = data.types;
    pokemon.img = data.sprites.other.home.front_default;
    const stats = data.stats.map(stat => stat.base_stat);
    [pokemon.stats.hp, pokemon.stats.atk, pokemon.stats.def, pokemon.stats.spAtk, pokemon.stats.spDef, pokemon.stats.spd] = stats;
    pokemon.primaryType = pokemon.types[0].type.name;
    pokemon.secondaryType = pokemon.types[1] ? pokemon.types[1].type.name : "None";
   
    // Fetch the evolution chain data
    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionChainRes = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainRes.json();

    let currentEvolution = evolutionChainData.chain;
    while (currentEvolution.evolves_to.length > 0) {
        currentEvolution = currentEvolution.evolves_to[0];
    }
    const highestEvolvedName = currentEvolution.species.name;
    const highestEvolvedUrl = `https://pokeapi.co/api/v2/pokemon/${highestEvolvedName}`;
    const highestEvolvedRes = await fetch(highestEvolvedUrl);
    const highestEvolvedData = await highestEvolvedRes.json();

    evolvedID = highestEvolvedData.id;

   // Check if the Pokémon can evolve
    canEvolve = checkEvolutionChain(species.name, evolutionChainData.chain);
}

function checkEvolutionChain(pokemonName, evolutionChain) {
    let currentEvolution = evolutionChain;

    while (currentEvolution) {
        if (currentEvolution.species.name === pokemonName) {
            // Check if there are further evolutions
            return currentEvolution.evolves_to.length > 0;
        }
        // Move to the next evolution in the chain
        if (currentEvolution.evolves_to.length > 0) {
            currentEvolution = currentEvolution.evolves_to[0];
        } else {
            break;
        }
    }

    return false;
}