// Pokémon data object
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

const seenSpecies = new Set();

async function getPokeAPIStats(num) {
    try {
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${num}`;
        const speciesRes = await fetch(speciesUrl);
        const speciesData = await speciesRes.json();

        const variety = speciesData.varieties.find(variety => variety.is_default);
        if (!variety) {
            throw new Error(`No default variety found for species ${speciesData.name}`);
        }

        const url = variety.pokemon.url;
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

        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainRes = await fetch(evolutionChainUrl);
        const evolutionChainData = await evolutionChainRes.json();

        let currentEvolution = evolutionChainData.chain;
        while (currentEvolution.evolves_to.length > 0) {
            currentEvolution = currentEvolution.evolves_to[0];
        }
        const highestEvolvedName = currentEvolution.species.name;

        const highestEvolvedVarietyUrl = `https://pokeapi.co/api/v2/pokemon/${highestEvolvedName}`;
        const highestEvolvedRes = await fetch(highestEvolvedVarietyUrl);
        if (!highestEvolvedRes.ok) {
            throw new Error(`Error fetching evolved form: ${highestEvolvedName}`);
        }
        const highestEvolvedData = await highestEvolvedRes.json();
        evolvedID = highestEvolvedData.id;

        canEvolve = checkEvolutionChain(species.name, evolutionChainData.chain);

        addSpeciesToSeen(evolutionChainData.chain);
    } catch (error) {
        console.error(`Error in getPokeAPIStats: ${error.message}`);
    }
}

function addSpeciesToSeen(evolutionChain) {
    let currentEvolution = evolutionChain;
    while (currentEvolution) {
        seenSpecies.add(currentEvolution.species.name);
        if (currentEvolution.evolves_to.length > 0) {
            currentEvolution = currentEvolution.evolves_to[0];
        } else {
            break;
        }
    }
}

function isSpeciesSeen(speciesName) {
    return seenSpecies.has(speciesName);
}

async function getValidRandomPokemon() {
    let randomPokemon;
    let speciesName;
    do {
        randomPokemon = getRandomPokemon();
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${randomPokemon}`;
        const speciesRes = await fetch(speciesUrl);
        const speciesData = await speciesRes.json();
        speciesName = speciesData.name;
    } while (isSpeciesSeen(speciesName));
    return randomPokemon;
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