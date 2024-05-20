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
        spd: document.getElementById("speed_amount"),
    },
    wrappers: {
        hp: document.getElementById("hp_wrapper"),
        atk: document.getElementById("attack_wrapper"),
        def: document.getElementById("defense_wrapper"),
        spAtk: document.getElementById("sp-atk_wrapper"),
        spDef: document.getElementById("sp-def_wrapper"),
        spd: document.getElementById("speed_wrapper"),
    },
    amountContainers: {
        hp: document.getElementById("hp_amount-container"),
        atk: document.getElementById("attack_amount-container"),
        def: document.getElementById("defense_amount-container"),
        spAtk: document.getElementById("sp-atk_amount-container"),
        spDef: document.getElementById("sp-def_amount-container"),
        spd: document.getElementById("speed_amount-container")
    }
};

const pokemonImage = document.getElementById("hero_pokemon");

// Reset summary data, stat icons, and remove highlights
function resetPokemonSummary() {
    summaryElements.secondaryType.classList.remove("u-display-none");
    Object.values(summaryElements.stats).forEach(stat => stat.textContent = "??");

    Object.values(summaryElements.stats).forEach(stat => {
        stat.classList.remove("selected_number", "higher_number");
    });

    // Remove stat icons
    Object.values(summaryElements.amountContainers).forEach(container => {
        // Clear all child elements except the amount text
        const amountElement = container.querySelector("div.summary_amount");
        if (amountElement) {
            container.innerHTML = "";
            container.appendChild(amountElement);
        } else {
            container.innerHTML = "";
        }
    });

    // Remove best choice highlight
    Object.values(summaryElements.wrappers).forEach(wrapper => wrapper.classList.remove("stats_best"));
}

// Highlight relevant stats (selected, higher, and best choice)
function highlightRelevantStats(selectedElement, selectedStatValue, selectedContainer) {
    // List of stats and corresponding summary elements
    const stats = [
        { value: pokemon.stats.hp, element: summaryElements.stats.hp, wrapper: summaryElements.wrappers.hp, container: summaryElements.amountContainers.hp, button: statButtons.hp },
        { value: pokemon.stats.atk, element: summaryElements.stats.atk, wrapper: summaryElements.wrappers.atk, container: summaryElements.amountContainers.atk, button: statButtons.atk },
        { value: pokemon.stats.def, element: summaryElements.stats.def, wrapper: summaryElements.wrappers.def, container: summaryElements.amountContainers.def, button: statButtons.def },
        { value: pokemon.stats.spAtk, element: summaryElements.stats.spAtk, wrapper: summaryElements.wrappers.spAtk, container: summaryElements.amountContainers.spAtk, button: statButtons.spAtk },
        { value: pokemon.stats.spDef, element: summaryElements.stats.spDef, wrapper: summaryElements.wrappers.spDef, container: summaryElements.amountContainers.spDef, button: statButtons.spDef },
        { value: pokemon.stats.spd, element: summaryElements.stats.spd, wrapper: summaryElements.wrappers.spd, container: summaryElements.amountContainers.spd, button: statButtons.spd }
    ];

    // Highlight the selected stat
    selectedElement.classList.add("selected_number");
    appendStatIcon(selectedContainer, "check");

    // Filter out already chosen stats
    const availableStats = stats.filter(stat => !stat.button.classList.contains("stats_chosen"));

    // Determine the highest stat value among available stats
    const highestValue = Math.max(...availableStats.map(stat => stat.value));

    // Highlight all stats that have the highest value and higher stats
    stats.forEach(stat => {
        stat.element.textContent = `${stat.value}`;

        // Highlight higher stats with arrow-up icon
        if (stat.value > selectedStatValue) {
            stat.element.classList.add("higher_number");
            appendStatIcon(stat.container, "arrowUp");
        } else {
            stat.element.classList.remove("higher_number");
            const existingArrow = stat.container.querySelector("div img[src='images/icons/ArrowUp.svg']");
            if (existingArrow) {
                existingArrow.parentElement.remove();
            }
        }

        // Highlight the best available stats
        if (stat.value === highestValue && !stat.button.classList.contains("stats_chosen")) {
            stat.wrapper.classList.add("stats_best");
        } else {
            stat.wrapper.classList.remove("stats_best");
        }
    });
}

// Append icon to amount container
function appendStatIcon(container, iconType) {
    const iconSrcMap = {
        check: "images/icons/check.svg",
        arrowUp: "images/icons/ArrowUp.svg"
    };

    const iconAltMap = {
        check: "Checkmark Icon",
        arrowUp: "Arrow Up Icon"
    };

    // Create the div and img elements
    const iconDiv = document.createElement("div");
    const iconImg = document.createElement("img");
    iconImg.src = iconSrcMap[iconType];
    iconImg.alt = iconAltMap[iconType];
    iconDiv.appendChild(iconImg);

    // Clear any existing icon before appending the new one
    const existingIcon = container.querySelector(`div img[src='${iconSrcMap[iconType]}']`);
    if (existingIcon) {
        existingIcon.parentElement.remove();
    }

    // Append the new icon
    container.appendChild(iconDiv);
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

    // Remove best choice highlight
    Object.values(summaryElements.wrappers).forEach(wrapper => wrapper.classList.remove("stats_best"));

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
statButtons.hp.addEventListener("click", () => selectStat(statButtons.hp, pokemon.stats.hp, summaryElements.stats.hp, summaryElements.amountContainers.hp));
statButtons.atk.addEventListener("click", () => selectStat(statButtons.atk, pokemon.stats.atk, summaryElements.stats.atk, summaryElements.amountContainers.atk));
statButtons.def.addEventListener("click", () => selectStat(statButtons.def, pokemon.stats.def, summaryElements.stats.def, summaryElements.amountContainers.def));
statButtons.spAtk.addEventListener("click", () => selectStat(statButtons.spAtk, pokemon.stats.spAtk, summaryElements.stats.spAtk, summaryElements.amountContainers.spAtk));
statButtons.spDef.addEventListener("click", () => selectStat(statButtons.spDef, pokemon.stats.spDef, summaryElements.stats.spDef, summaryElements.amountContainers.spDef));
statButtons.spd.addEventListener("click", () => selectStat(statButtons.spd, pokemon.stats.spd, summaryElements.stats.spd, summaryElements.amountContainers.spd));

// Select stat and highlight relevant stats
function selectStat(button, statValue, summaryValue, container) {
    if (statSelected || button.classList.contains("stats_chosen")) return;

    highlightRelevantStats(summaryValue, statValue, container);

    button.innerHTML += ` - ${statValue}`;
    button.classList.add("stats_chosen");
    button.disabled = true;

    gameScore += statValue;
    updateScoreDisplay();
    statSelected = true;

    disableNonSelectedStatButtons();
    updateSummaryStats(); // Update stats first

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