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

const pokeball = document.getElementById("pokeball-svg");

const pokeballTimeline = gsap.timeline({defaults: { ease: "power4.out" }});

pokeballTimeline
    .to("#pokeball-svg", { rotation: 90, duration: 0.5 })
    .to("#pokeball-bottom", { duration: 0.5, y: 100 })
    .to("#pokeball-top", { duration: 0.5, y: -100 }, '<');

pokeballTimeline.pause();

function animatePokeball() {
    pokeballTimeline.play();
}