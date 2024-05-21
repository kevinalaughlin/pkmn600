const gameResults = document.getElementById("game-results");

const resultElements = {
    userScore: document.getElementById("results_points"),
    maxScore: document.getElementById("results_max"),
    image: document.getElementById("achievement")
}

let achievementImage = "";
let achievementAlt = "";

function winOrLose() {
    if (gameScore >= 600) {
        achievementImage = `images/achievements/victory.svg`;
        achievementAlt = "Victory banner";
    } else {
        achievementImage = `images/achievements/defeat.svg`;
        achievementAlt = "Defeat banner";
    }
}

function endGame() {
    winOrLose();
    resultElements.userScore.innerHTML = gameScore;
    resultElements.maxScore.innerHTML = maxScore;
    resultElements.image.src = achievementImage;
    resultElements.image.alt = achievementAlt;
    gameResults.classList.remove("u-display-none");
    console.log("You win/lose");
}

document.getElementById("restart_button").addEventListener("click", () => {
    location.reload();
});