const startButton = document.getElementById("start-button");
const scoreWrapper = document.getElementById("score");
const settingsWrapper = document.getElementById("settings");
const summaryWrapper = document.getElementById("summary");

const generationButtons = {
    gen1: document.getElementById("gen-1"),
    gen2: document.getElementById("gen-2"),
    gen3: document.getElementById("gen-3"),
    gen4: document.getElementById("gen-4"),
    gen5: document.getElementById("gen-5"),
    gen6: document.getElementById("gen-6"),
    gen7: document.getElementById("gen-7"),
    gen8: document.getElementById("gen-8"),
    gen9: document.getElementById("gen-9")
}

const generationRanges = {
    gen1: { min: 1, max: 151 },
    gen2: { min: 152, max: 251 },
    gen3: { min: 252, max: 386 },
    gen4: { min: 387, max: 493 },
    gen5: { min: 494, max: 649 },
    gen6: { min: 650, max: 721 },
    gen7: { min: 722, max: 809 },
    gen8: { min: 810, max: 905 },
    gen9: { min: 906, max: 1010 }
};

let generationData = [];

function storeGenerationData() {
    if (generationButtons.gen1.checked) { generationData.push(generationRanges.gen1) };
    if (generationButtons.gen2.checked) { generationData.push(generationRanges.gen2) };
    if (generationButtons.gen3.checked) { generationData.push(generationRanges.gen3) };
    if (generationButtons.gen4.checked) { generationData.push(generationRanges.gen4) };
    if (generationButtons.gen5.checked) { generationData.push(generationRanges.gen5) };
    if (generationButtons.gen6.checked) { generationData.push(generationRanges.gen6) };
    if (generationButtons.gen7.checked) { generationData.push(generationRanges.gen7) };
    if (generationButtons.gen8.checked) { generationData.push(generationRanges.gen8) };
    if (generationButtons.gen9.checked) { generationData.push(generationRanges.gen9) };
}

function getRandomPokemonNumber() {
    // Randomly select one of the generation ranges
    const randomGenerationRange = generationData[Math.floor(Math.random() * generationData.length)];
    // Generate a random number within the selected range
    return Math.floor(Math.random() * (randomGenerationRange.max - randomGenerationRange.min + 1)) + randomGenerationRange.min;
}

startButton.addEventListener("click", () => {
    scoreWrapper.classList.remove("u-opacity-0");
    settingsWrapper.classList.add("u-display-none");
    summaryWrapper.classList.remove("u-display-none");
    storeGenerationData();
});

generationButtons.gen1.addEventListener("mouseenter", function() {
    generationButtons.gen1.checked  = false;
    console.log(generationButtons.gen1.checked);
});