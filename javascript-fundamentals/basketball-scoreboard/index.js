let homeScore = document.getElementById("home-score");
let guestScore = document.getElementById("guest-score");

const buttonHelper = (e) => {
    const target = e.target.parentElement.id;
    const point = parseInt(e.target.value);

    let homeCount = parseInt(homeScore.innerText);
    let guestCount = parseInt(guestScore.innerText);

    if (target === "home") {
        homeCount += point;
        homeScore.innerText = homeCount;
    }

    if (target === "guest") {
        guestCount += point;
        guestScore.innerText = guestCount;
    }
}

let buttons = document.getElementsByClassName("points");
for (const button of buttons) {
    for (const points of button.children) {
        points.addEventListener("click", buttonHelper)
    }
}

let newGame = document.getElementById("new-game");
newGame.addEventListener("click", () => {
    guestScore.innerText = "0";
    homeScore.innerText = "0";
})
