let pokemonName = "";
let pokemonId = 0;
let pokemonType = [];
let pokemonImg = "";
let pokemonHp = 0;
let pokemonAtk = 0;
let pokemonDef = 0;
let pokemonSpAtk = 0;
let pokemonSpDef = 0;
let pokemonSpd = 0;
let pokemonPrimaryType = "";
let pokemonSecondaryType = "";

async function getPokemonStats(num) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString();

    let res = await fetch(url);
    let pokemon = await res.json();

    pokemonName = pokemon["name"];
    pokemonId = pokemon["id"];
    pokemonType = pokemon["types"];
    pokemonImg = pokemon["sprites"]["other"]["home"]["front_default"];
    pokemonHp = pokemon["stats"][0]["base_stat"];
    pokemonAtk = pokemon["stats"][1]["base_stat"];
    pokemonDef = pokemon["stats"][2]["base_stat"];
    pokemonSpAtk = pokemon["stats"][3]["base_stat"];
    pokemonSpDef = pokemon["stats"][4]["base_stat"];
    pokemonSpd = pokemon["stats"][5]["base_stat"];
    pokemonPrimaryType = pokemonType[0]["type"]["name"];

    // Secondary type (check if it exists)
    if (pokemonType.length > 1) {
        pokemonSecondaryType = pokemonType[1]["type"]["name"];
    } else {
        pokemonSecondaryType = "None";
    }
}

function getRandomPokemon() {
    return Math.floor(Math.random() * 1025) + 1;
}

async function updateHeroPokemon() {
    await getPokemonStats(getRandomPokemon());

    // Update Pokémon image
    const pokemonImage = document.getElementById("hero_pokemon");
    pokemonImage.src = pokemonImg;
    pokemonImage.alt = `Image of ${pokemonName}`;

    // Update Pokémon name, order, and types
    document.getElementById("hero_text--pokemon-name-number").innerHTML = `${pokemonName}\u00A0\u00A0\u00A0*\u00A0\u00A0\u00A0#${pokemonId}`;

    const pokemonTypeText = document.getElementById("hero_text--type");
    pokemonTypeText.innerHTML = `${pokemonPrimaryType}`;

    if (pokemonSecondaryType !== "None") {
        pokemonTypeText.innerHTML += `\u00A0\u00A0\u00A0+\u00A0\u00A0\u00A0${pokemonSecondaryType}`;
    }
}

document.getElementById("testPokemon").addEventListener("click", async () => {
    document.getElementById("hero_pokeball").classList.add("u-size-hidden"); // Shrinks Pokéball
    await updateHeroPokemon();
});