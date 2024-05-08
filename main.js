async function getPokemonStats(num) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString();

    let res = await fetch(url);
    let pokemon = await res.json();
    // console.log(pokemon);

    let pokemonName = pokemon["name"];
    let pokemonType = pokemon["types"];
    let pokemonImg = pokemon["sprites"]["front_default"];
    let pokemonHp = pokemon["stats"]["0"]["base_stat"];
    let pokemonAtk = pokemon["stats"]["1"]["base_stat"];
    let pokemonDef = pokemon["stats"]["2"]["base_stat"];
    let pokemonSpAtk = pokemon["stats"]["3"]["base_stat"];
    let pokemonSpDef = pokemon["stats"]["4"]["base_stat"];
    let pokemonSpd = pokemon["stats"]["5"]["base_stat"];

    console.log(pokemonName);
}

function getRandomPokemon() {
    return Math.floor(Math.random() * 1025) + 1;
}

getPokemonStats(getRandomPokemon());