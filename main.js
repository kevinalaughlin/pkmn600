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

// Get Pokémon stats from PokeAPI
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
}

// Generate a random number between 1 - 1025 (current number of Pokémon)
function getRandomPokemon() {
    return Math.floor(Math.random() * 1025) + 1;
}

// DOM elements
const summaryElements = {
    name: document.getElementById("summary_name"),
    number: document.getElementById("summary_number"),
    primaryType: document.getElementById("summary_primary-type"),
    secondaryType: document.getElementById("summary_secondary-type"),
    img: document.getElementById("summary_pokemon"),
    stats: {
        hp: document.getElementById("hp_amount"),
        atk: document.getElementById("attack_amount"),
        def: document.getElementById("defense_amount"),
        spAtk: document.getElementById("sp-atk_amount"),
        spDef: document.getElementById("sp-def_amount"),
        spd: document.getElementById("speed_amount")
    }
};

const pokemonImage = document.getElementById("hero_pokemon");

// Reset summary data
function resetPokemonSummary() {
    summaryElements.secondaryType.classList.remove("u-display-none");
    Object.values(summaryElements.stats).forEach(stat => stat.textContent = "??");
    removeStatHighlights();
}

// Remove highlights from all stats
function removeStatHighlights() {
    Object.values(summaryElements.stats).forEach(stat => {
        stat.classList.remove("selected_number", "higher_number");
    });
}

// Highlight both the selected and highest stat
function highlightStats(selectedElement, selectedStatValue) {
    // Highlight the selected stat
    selectedElement.classList.add("selected_number");

    // List of stats and corresponding summary elements
    const stats = [
        { value: pokemon.stats.hp, element: summaryElements.stats.hp },
        { value: pokemon.stats.atk, element: summaryElements.stats.atk },
        { value: pokemon.stats.def, element: summaryElements.stats.def },
        { value: pokemon.stats.spAtk, element: summaryElements.stats.spAtk },
        { value: pokemon.stats.spDef, element: summaryElements.stats.spDef },
        { value: pokemon.stats.spd, element: summaryElements.stats.spd }
    ];

    // Update the textContent and apply styles
    stats.forEach(stat => {
        stat.element.textContent = `${stat.value}`;

        if (stat.value > selectedStatValue) {
            stat.element.classList.add("higher_number");
            stat.element.textContent += ` ↑`;
        } else {
            stat.element.classList.remove("higher_number");
        }
    });
}

const heroTextSolid = document.getElementById("hero_text--solid");
const heroTextOutline = document.getElementById("hero_text--outlined");

// Update hero and summary sections with Pokémon data
async function updateHeroPokemon() {
    await getPokeAPIStats(getRandomPokemon());

    pokemonImage.src = pokemon.img;
    pokemonImage.alt = `Image of ${species.name}`;
    heroTextSolid.innerHTML = `${species.name}`;
    heroTextOutline.innerHTML = `${species.name}`;

    summaryElements.name.innerHTML = species.name;
    summaryElements.number.innerHTML = `#${pokemon.id}`;
    summaryElements.primaryType.innerHTML = pokemon.primaryType;
    if (pokemon.secondaryType !== "None") {
        summaryElements.secondaryType.innerHTML = pokemon.secondaryType;
    } else {
        summaryElements.secondaryType.classList.add("u-display-none");
    }
}

function updateSummaryStats() {
    summaryElements.stats.hp.textContent = `${pokemon.stats.hp}`;
    summaryElements.stats.atk.textContent = `${pokemon.stats.atk}`;
    summaryElements.stats.def.textContent = `${pokemon.stats.def}`;
    summaryElements.stats.spAtk.textContent = `${pokemon.stats.spAtk}`;
    summaryElements.stats.spDef.textContent = `${pokemon.stats.spDef}`;
    summaryElements.stats.spd.textContent = `${pokemon.stats.spd}`;
}

let statSelected = false;

const pokeball = document.getElementById("hero_pokeball");

// Generate new Pokémon
pokeball.addEventListener("click", async () => {
    pokeball.classList.add("u-display-none");
    pokemonImage.classList.remove("u-display-none");
    resetPokemonSummary();
    await updateHeroPokemon();
    enableNonSelectedStatButtons();
    statSelected = false;
});

// Stat button elements
const statButtons = {
    hp: document.getElementById("HP"),
    atk: document.getElementById("Attack"),
    def: document.getElementById("Defense"),
    spAtk: document.getElementById("SpAtk"),
    spDef: document.getElementById("SpDef"),
    spd: document.getElementById("Speed")
};

// Disable all stat buttons. Generating a pokemon enables them.
function disableAllStatButtons() {
    Object.values(statButtons).forEach(button => {
        button.disabled = true;
    });
}

disableAllStatButtons();

// Add event listeners to stat buttons
statButtons.hp.addEventListener("click", () => selectStat(statButtons.hp, pokemon.stats.hp, summaryElements.stats.hp));
statButtons.atk.addEventListener("click", () => selectStat(statButtons.atk, pokemon.stats.atk, summaryElements.stats.atk));
statButtons.def.addEventListener("click", () => selectStat(statButtons.def, pokemon.stats.def, summaryElements.stats.def));
statButtons.spAtk.addEventListener("click", () => selectStat(statButtons.spAtk, pokemon.stats.spAtk, summaryElements.stats.spAtk));
statButtons.spDef.addEventListener("click", () => selectStat(statButtons.spDef, pokemon.stats.spDef, summaryElements.stats.spDef));
statButtons.spd.addEventListener("click", () => selectStat(statButtons.spd, pokemon.stats.spd, summaryElements.stats.spd));

function selectStat(button, statValue, summaryValue) {
    if (statSelected || button.classList.contains("stats_chosen")) return;

    button.innerHTML += ` - ${statValue}`;
    button.classList.add("stats_chosen");
    button.disabled = true;

    gameScore += statValue;
    updateScoreDisplay();
    statSelected = true;

    disableNonSelectedStatButtons();
    updateSummaryStats(); // Update stats first
    highlightStats(summaryValue, statValue); // Highlight stats afterward

    // Re-enable the Pokeball generator
    pokeball.classList.remove("u-display-none");
    pokemonImage.classList.add("u-display-none");
    pokemonImage.src = "";
    pokemonImage.alt = "";
    heroTextSolid.innerHTML = "";
    heroTextOutline.innerHTML = "";

    if (allStatsChosen()) {
        endGame();
        console.log(`Final Score: ${gameScore}`);
    }
}

// Enable non-selected stat buttons
function enableNonSelectedStatButtons() {
    Object.values(statButtons).forEach(button => {
        if (!button.classList.contains("stats_chosen")) {
            button.disabled = false;
        }
    });
}

// Disable non-selected stat buttons
function disableNonSelectedStatButtons() {
    Object.values(statButtons).forEach(button => {
        if (!button.classList.contains("stats_chosen")) {
            button.disabled = true;
        }
    });
}

// Check if all stats have been chosen
function allStatsChosen() {
    return Object.values(statButtons).every (button => button.classList.contains("stats_chosen"));
}

// Game score
let gameScore = 0;
const scoreNumber = document.getElementById("score_number");
scoreNumber.innerHTML = gameScore;

function updateScoreDisplay() {
    scoreNumber.innerHTML = gameScore;
}

const statButtonGroup = document.getElementById("stats");

// End game after all stats chosen
function endGame() {
    pokeball.classList.add("u-display-none");
    statButtonGroup.classList.add("u-display-none");
}