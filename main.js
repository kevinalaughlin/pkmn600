let gameScore = 0;

const scoreNumber = document.getElementById("score_number");
scoreNumber.innerHTML = gameScore;

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

const pokemonImage = document.getElementById("hero_pokemon");
const pokemonTypeText = document.getElementById("hero_text--type");

const summaryName = document.getElementById("summary_name");
const summaryNumber = document.getElementById("summary_number");
const summaryPrimaryType = document.getElementById("summary_primary-type");
const summarySecondaryType = document.getElementById("summary_secondary-type");
const summaryHP = document.getElementById("hp_amount");
const summaryAttack = document.getElementById("attack_amount");
const summaryDefense = document.getElementById("defense_amount");
const summarySpAtk = document.getElementById("sp-atk_amount");
const summarySpDef = document.getElementById("sp-def_amount");
const summarySpeed = document.getElementById("speed_amount");
const summaryPokemonImage = document.getElementById("summary_pokemon");

const buttonHP = document.getElementById("HP");
const buttonAttack = document.getElementById("Attack");
const buttonDefense = document.getElementById("Defense");
const buttonSpAtk = document.getElementById("SpAtk");
const buttonSpDef = document.getElementById("SpDef");
const buttonSpeed = document.getElementById("Speed");

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

function resetPokemonInfo() {
    summarySecondaryType.classList.remove("u-display-none");
    summaryHP.innerHTML = "??";
    summaryAttack.innerHTML = "??";
    summaryDefense.innerHTML = "??";
    summarySpAtk.innerHTML = "??";
    summarySpDef.innerHTML = "??";
    summarySpeed.innerHTML = "??";
}

async function updateHeroPokemon() {
    await getPokemonStats(getRandomPokemon());

    // Update Hero Pokémon image
    pokemonImage.src = pokemonImg;
    pokemonImage.alt = `Image of ${pokemonName}`;

    // Update Hero Pokémon name, order, and types
    document.getElementById("hero_text--pokemon-name-number").innerHTML = `${pokemonName}\u00A0\u00A0\u00A0*\u00A0\u00A0\u00A0#${pokemonId}`;

    pokemonTypeText.innerHTML = `${pokemonPrimaryType}`;

    if (pokemonSecondaryType !== "None") {
        pokemonTypeText.innerHTML += `\u00A0\u00A0\u00A0+\u00A0\u00A0\u00A0${pokemonSecondaryType}`;
    }

    // Update Summary name, order, types, and images
    summaryName.innerHTML = `${pokemonName}`;
    summaryNumber.innerHTML = `#${pokemonId}`;
    summaryPrimaryType.innerHTML = `${pokemonPrimaryType}`;
    if (pokemonSecondaryType !== "None") {
        summarySecondaryType.innerHTML = `${pokemonSecondaryType}`;
    } else {
        summarySecondaryType.classList.add("u-display-none"); // Hides secondary class
    }

    summaryPokemonImage.src = pokemonImg;
    summaryPokemonImage.alt = `Image of ${pokemonName}`;
}


async function updatePokemonInfo() {
    summaryHP.innerHTML =`${pokemonHp}`;
    summaryAttack.innerHTML =`${pokemonAtk}`;
    summaryDefense.innerHTML =`${pokemonDef}`;
    summarySpAtk.innerHTML =`${pokemonSpAtk}`;
    summarySpDef.innerHTML =`${pokemonSpDef}`;
    summarySpeed.innerHTML =`${pokemonSpd}`;
}

let statSelected = false;

document.getElementById("testPokemon").addEventListener("click", async () => {
    document.getElementById("hero_pokeball").classList.add("u-size-hidden"); // Shrinks Pokéball
    resetPokemonInfo();
    await updateHeroPokemon();
    enableNonSelectedStatButtons(); // Re-enable only non-selected stat buttons
    statSelected = false;
});

const statButtons = document.querySelectorAll("#stats button");

statButtons.forEach(button => {
    button.addEventListener("click", async () => {
        await updatePokemonInfo();
    });
});

// Function to handle stat button clicks
function selectStat(button, statValue) {
    if (statSelected || button.classList.contains("stats_chosen")) return; // Prevent multiple selections

    button.innerHTML += ` - ${statValue}`;
    button.classList.add("stats_chosen");
    button.disabled = true;
    gameScore += statValue;
    updateScoreDisplay();
    statSelected = true;

    // Disable all other non-chosen stat buttons
    disableNonSelectedStatButtons();
}

// Adding event listeners using a generic handler
buttonHP.addEventListener("click", () => selectStat(buttonHP, pokemonHp));
buttonAttack.addEventListener("click", () => selectStat(buttonAttack, pokemonAtk));
buttonDefense.addEventListener("click", () => selectStat(buttonDefense, pokemonDef));
buttonSpAtk.addEventListener("click", () => selectStat(buttonSpAtk, pokemonSpAtk));
buttonSpDef.addEventListener("click", () => selectStat(buttonSpDef, pokemonSpDef));
buttonSpeed.addEventListener("click", () => selectStat(buttonSpeed, pokemonSpd));

// Function to enable only non-selected stat buttons
function enableNonSelectedStatButtons() {
    statButtons.forEach(button => {
        if (!button.classList.contains("stats_chosen")) {
            button.disabled = false;
        }
    });
}

// Function to disable non-selected stat buttons
function disableNonSelectedStatButtons() {
    statButtons.forEach(button => {
        if (!button.classList.contains("stats_chosen")) {
            button.disabled = true;
        }
    });
}

// Function to update the score display
function updateScoreDisplay() {
    scoreNumber.innerHTML = gameScore;
}
