function animateElement(element, action) {
    element.classList[action]("u-display-none");
}

function animatePokeballOut() {

}

function animatePokeballIn() {

}

function animatePokemonOut() {
    animateElement(summaryElements.image, "add");
}

function animatePokemonIn() {
    animateElement(summaryElements.image, "remove");
}

function animateStatsOut() {
    Object.values(summaryElements.number).forEach(stat => stat.classList.add("u-display-none"));
}

function animateStatsIn() {
    Object.values(summaryElements.number).forEach(stat => stat.classList.remove("u-display-none"));
}