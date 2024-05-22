// Pokémon data object
let pokemon = { name: "", id: 0, types: [], img: "", stats: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 }, primaryType: "", secondaryType: "" };

let species = { name: "", generation: "" };

let evolution = { id: "", options: "", evolvesTo: "" };

let evolvedID = 0;

const seenSpecies = [];

async function getPokeAPIStats(num) {
    const url = `https://pokeapi.co/api/v2/pokemon/${num}`;
    const res = await fetch(url);
    const data = await res.json();

    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${num}`;
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();

    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionChainRes = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainRes.json();

    species.name = speciesData.name;
    species.generation = speciesData.generation.name;

    pokemon.name = data.name;
    pokemon.id = data.id;
    pokemon.types = data.types;
    pokemon.img = data.sprites.other.home.front_default;

    const stats = data.stats.map(stat => stat.base_stat);
    [pokemon.stats.hp, pokemon.stats.atk, pokemon.stats.def, pokemon.stats.spAtk, pokemon.stats.spDef, pokemon.stats.spd] = stats;

    pokemon.primaryType = pokemon.types[0].type.name;
    pokemon.secondaryType = pokemon.types[1] ? pokemon.types[1].type.name : "None";

    evolution.id = evolutionChainData.id;
    console.log(isEvolving);

    // Check for duplicate evolution.id
    if (!isEvolving && seenSpecies.includes(evolution.id)) {
        console.log(`Duplicate evolution id found: ${evolution.id}. Generating a new Pokémon...`);
        await generatePokemon(getRandomPokemonNumber());
        return; // Exit the current function and prevent further execution
    }

    isEvolving = false;

    const baseEvolutionArray = evolutionChainData.chain.evolves_to;
    
    let canEvolve = true;
    
    if (baseEvolutionArray.length === 0) {
        evolution.evolvesTo = "Nothing";
        evolution.options = 0;
        canEvolve = false;
    }
    else if (baseEvolutionArray.length === 1 && evolutionChainData.chain.evolves_to[0].evolves_to.length > 0) {
        const additionalEvolutionArray = evolutionChainData.chain.evolves_to[0].evolves_to;
        evolution.evolvesTo = additionalEvolutionArray[Math.floor(Math.random() * additionalEvolutionArray.length)].species.name;
        evolution.options = additionalEvolutionArray.length;
        for (let i = 0; i < evolution.options; i++) {
            if (species.name === additionalEvolutionArray[i].species.name) {
                canEvolve = false;
                break;
            }
        }
    } else  {
        evolution.evolvesTo = baseEvolutionArray[Math.floor(Math.random() * baseEvolutionArray.length)].species.name;
        evolution.options = baseEvolutionArray.length;
        for (let i = 0; i < evolution.options; i++) {
            if (species.name === baseEvolutionArray[i].species.name) {
                canEvolve = false;
                break;
            }
        }
    }

    console.log(`${pokemon.name}'s evolution id is ${evolution.id} and has ${evolution.options} evolution options. If evolved, it will evolve into ${evolution.evolvesTo}. Can it evolve? ${canEvolve}.`);

    // Enable or disable evolve button
    if (canEvolve && !evolveUsed) {
        powerEvolve.disabled = false;
    } else {
        powerEvolve.disabled = true;
    }

    // Push evolution chain number to seenSpecies array
    seenSpecies.push(evolution.id);
    console.log(seenSpecies);
    
    // Get evolved pokemon data
    if (canEvolve) {
        // Get evolved Pokémon data
        const evolvedSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${evolution.evolvesTo}`;
        const evolvedSpeciesRes = await fetch(evolvedSpeciesUrl);
        const evolvedSpeciesData = await evolvedSpeciesRes.json();

        let pokemonVariety = evolvedSpeciesData.varieties[0].pokemon.name;

        const fullyEvolvedUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonVariety}`;
        const fullyEvolvedRes = await fetch(fullyEvolvedUrl);
        const fullyEvolvedData = await fullyEvolvedRes.json();

        evolvedID = fullyEvolvedData.id;
    }
}