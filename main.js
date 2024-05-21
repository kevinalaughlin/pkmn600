const summaryElements = {
    image: document.getElementById("hero_pokemon"),
    name: document.getElementById("preview_name"),
    primaryType: document.getElementById("preview_type-primary"),
    secondaryType: document.getElementById("preview_type-secondary"),
    buttons: {
        hp: document.getElementById("hp-button"),
        attack: document.getElementById("attack-button"),
        defense: document.getElementById("defense-button"),
        spAtk: document.getElementById("spAtk-button"),
        spDef: document.getElementById("spDef-button"),
        speed: document.getElementById("speed-button")
    },
    results: {
        hp: document.getElementById("hp-number-wrapper"),
        attack: document.getElementById("attack-number-wrapper"),
        defense: document.getElementById("defense-number-wrapper"),
        spAtk: document.getElementById("spAtk-number-wrapper"),
        spDef: document.getElementById("spDef-number-wrapper"),
        speed: document.getElementById("speed-number-wrapper")
    },
    number: {
        hp: document.getElementById("hp-number"),
        attack: document.getElementById("attack-number"),
        defense: document.getElementById("defense-number"),
        spAtk: document.getElementById("spAtk-number"),
        spDef: document.getElementById("spDef-number"),
        speed: document.getElementById("speed-number")
    },
};

// Generate a random number between 1 - 1025 (current number of Pokémon)
function getRandomPokemon() {
    return Math.floor(Math.random() * 1025) + 1;
}


// Update all stat elements
function updateAllStats() {
    summaryElements.number.hp.innerHTML = pokemon.stats.hp;
    summaryElements.number.attack.innerHTML = pokemon.stats.atk;
    summaryElements.number.defense.innerHTML = pokemon.stats.def;
    summaryElements.number.spAtk.innerHTML = pokemon.stats.spAtk;
    summaryElements.number.spDef.innerHTML = pokemon.stats.spDef;
    summaryElements.number.speed.innerHTML = pokemon.stats.spd;
}

// Add event listeners for each button
summaryElements.buttons.hp.addEventListener("click", () => selectStat(summaryElements.number.hp, pokemon.stats.hp, summaryElements.buttons.hp));
summaryElements.buttons.attack.addEventListener("click", () => selectStat(summaryElements.number.attack, pokemon.stats.atk, summaryElements.buttons.attack));
summaryElements.buttons.defense.addEventListener("click", () => selectStat(summaryElements.number.defense, pokemon.stats.def, summaryElements.buttons.defense));
summaryElements.buttons.spAtk.addEventListener("click", () => selectStat(summaryElements.number.spAtk, pokemon.stats.spAtk, summaryElements.buttons.spAtk));
summaryElements.buttons.spDef.addEventListener("click", () => selectStat(summaryElements.number.spDef, pokemon.stats.spDef, summaryElements.buttons.spDef));
summaryElements.buttons.speed.addEventListener("click", () => selectStat(summaryElements.number.speed, pokemon.stats.spd, summaryElements.buttons.speed));

function highlightRelevantStats(selectedElement, selectedStatValue, selectedContainer) {
    // Create an array of stats objects to manage element references and values
    const stats = [
        { name: "hp", value: pokemon.stats.hp, element: summaryElements.number.hp, wrapper: summaryElements.results.hp, button: summaryElements.buttons.hp },
        { name: "atk", value: pokemon.stats.atk, element: summaryElements.number.attack, wrapper: summaryElements.results.attack, button: summaryElements.buttons.attack },
        { name: "def", value: pokemon.stats.def, element: summaryElements.number.defense, wrapper: summaryElements.results.defense, button: summaryElements.buttons.defense },
        { name: "spAtk", value: pokemon.stats.spAtk, element: summaryElements.number.spAtk, wrapper: summaryElements.results.spAtk, button: summaryElements.buttons.spAtk },
        { name: "spDef", value: pokemon.stats.spDef, element: summaryElements.number.spDef, wrapper: summaryElements.results.spDef, button: summaryElements.buttons.spDef },
        { name: "spd", value: pokemon.stats.spd, element: summaryElements.number.speed, wrapper: summaryElements.results.speed, button: summaryElements.buttons.speed }
    ];

    // Filter out already chosen stats
    const availableStats = stats.filter(stat => !stat.button.classList.contains("stats_chosen"));

    // Determine the highest available stat value
    const highestAvailableStat = availableStats.reduce((max, stat) => stat.value > max.value ? stat : max, availableStats[0]);

    // Add the higher_number class and append arrow icons to stats higher than the selected value
    stats.forEach(stat => {
        if (stat.value > selectedStatValue) {
            appendStatIcon(stat.wrapper, "arrowUp");
        }

        if (stat === highestAvailableStat && !stat.button.classList.contains("stats_chosen") && stat.value > selectedStatValue) {
            stat.button.classList.add("higher_number");
        }
    });

    selectedContainer.classList.add("selected_number");
    appendStatIcon(summaryElements.results[selectedElement.id.replace("-number", "")], "check");
}

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

function resetStatsAndIcons() {
    // Remove highlighted classes from buttons
    Object.values(summaryElements.buttons).forEach(button => {
        button.classList.remove("higher_number", "selected_number");
    });

    // Remove all appended icons
    Object.values(summaryElements.results).forEach(wrapper => {
        const icons = wrapper.querySelectorAll("div");
        icons.forEach(icon => icon.remove());
    });
}

function disableButtons() {
    Object.values(summaryElements.buttons).forEach(button => {
        button.disabled = true;
    });
}

disableButtons();

function enableButtons() {
    Object.values(summaryElements.buttons).forEach(button => {
        if (!button.classList.contains("stats_chosen")) {
            button.disabled = false;
        }
    });
}

// Update Game Score
const scoreNumber = document.getElementById("score_points");
let gameScore = 0;
scoreNumber.innerHTML = gameScore;

function updateScoreDisplay() {
    scoreNumber.innerHTML = gameScore;
}

// Update Round
const currentRound = document.getElementById("current_round");
let round = 1;
currentRound.innerHTML = round;

function updateRoundDisplay() {
    currentRound.innerHTML = round;
}

// Trade Pokemon
const powerTrade = document.getElementById("power_trade");

powerTrade.addEventListener("click", async () => {
    await generatePokemon();
    powerTrade.disabled = true;
});

// Evolve Pokemon
const powerEvolve = document.getElementById("power_evolve");
let evolveUsed = false;
let isEvolving = false;


powerEvolve.disabled = true;

powerEvolve.addEventListener("click", () => {
    isEvolving = true;
    generatePokemon(evolvedID);
    powerEvolve.disabled = true;
    evolveUsed = true;
});

// Game assets
const pokeball = document.getElementById("hero_pokeball");

// Generate new Pokemon with an optional ID parameter
async function generatePokemon(pokemonID = getRandomPokemon()) {
    resetStatsAndIcons(); // Reset stats and icons
    enableButtons();
    await getPokeAPIStats(pokemonID);
    animatePokeballOut();
    animatePokemonIn();
    animateStatsOut();

    summaryElements.secondaryType.classList.remove("u-display-none");
    summaryElements.image.src = pokemon.img;
    summaryElements.image.alt = `Image of ${species.name}`;
    summaryElements.name.innerHTML = `${species.name}`;
    summaryElements.primaryType.innerHTML = `${pokemon.primaryType}`;
    summaryElements.secondaryType.innerHTML = `${pokemon.secondaryType}`;

    if (pokemon.secondaryType !== "None") {
        summaryElements.secondaryType.innerHTML = pokemon.secondaryType;
    } else {
        summaryElements.secondaryType.classList.add("u-display-none");
    }
}

pokeball.addEventListener("click", () => {
    generatePokemon();
});

const caughtPokemon = [];

// Function to calculate the maximum possible score
function calculateMaximumPossibleScore() {
    let bestScore = 0;
    let bestCombination = [];

    function calculateScore(index, usedStats, currentScore, currentCombination) {
        if (index === caughtPokemon.length) {
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestCombination = [...currentCombination];
            }
            return;
        }

        const pokemon = caughtPokemon[index];
        for (let stat in pokemon.stats) {
            if (!usedStats.has(stat)) {
                usedStats.add(stat);
                currentCombination.push({ pokemon: pokemon.name, stat, value: pokemon.stats[stat] });
                calculateScore(index + 1, usedStats, currentScore + pokemon.stats[stat], currentCombination);
                usedStats.delete(stat);
                currentCombination.pop();
            }
        }
    }

    calculateScore(0, new Set(), 0, []);

    // Log the choices made for calculating the maximum score
    console.log("Choices made for calculating maximum score:");
    bestCombination.forEach(choice => {
        console.log(`Pokémon: ${choice.pokemon}, Stat: ${choice.stat}, Value: ${choice.value}`);
    });

    return bestScore;
}

// Function to update the displayed maximum possible score
function updateMaximumPossibleScoreDisplay() {
    const maxScore = calculateMaximumPossibleScore();
    const maxScoreElement = document.getElementById("score_max");
    maxScoreElement.innerHTML = maxScore;
}

// Example usage: update the maximum possible score after selecting a stat
function selectStat(stat, statValue, button) {
    button.classList.add("stats_chosen");
    button.disabled = true;
    gameScore += statValue;
    round++;

    // Store the current Pokémon data in a new object
    const currentPokemonData = {
        name: species.name,
        generation: species.generation,
        id: pokemon.id,
        types: pokemon.types,
        img: pokemon.img,
        stats: { ...pokemon.stats },
        primaryType: pokemon.primaryType,
        secondaryType: pokemon.secondaryType
    };

    // Add the object to the caughtPokemon array
    caughtPokemon.push(currentPokemonData);

    // Update the maximum possible score display
    updateMaximumPossibleScoreDisplay();

    disableButtons();
    updateAllStats();
    animateStatsIn();
    highlightRelevantStats(stat, statValue, button);
    updateScoreDisplay();
    updateRoundDisplay();
    animatePokemonOut();
    animatePokeballIn();
}