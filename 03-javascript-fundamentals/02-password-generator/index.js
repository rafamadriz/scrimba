const uppercase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const lowercase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbols = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "[", "}", "]", ",", "|", ":", ";", "<", ">", ".", "?", "/"];

function PasswordSettingsGenerator(symbols, numbers, uppercase, lowercase) {
    let enabled = [...document.getElementsByClassName("settings-toggles")]
      .filter(setting => setting.checked && setting)
      .map(enabled => enabled.name);

    if (enabled.length < 2) {
        enabled = ["symbols", "numbers", "uppercase", "lowercase"]
    }

    for (const setting of enabled) {
        switch (setting) {
          case "symbols":
            this.symbols = symbols;
            break;
          case "numbers":
            this.numbers = numbers;
            break;
          case "uppercase":
            this.uppercase = uppercase;
            break;
          case "lowercase":
            this.lowercase = lowercase;
            break;
        }
    }
}

function randomNumber(maxRange) {
    return Math.floor(Math.random() * maxRange);
}

function chooseRandomSetting() {
    const PasswordSettings = new PasswordSettingsGenerator(symbols, numbers, uppercase, lowercase)
    const passwordSettingsKeys = Object.keys(PasswordSettings);
    const setting = passwordSettingsKeys[randomNumber(passwordSettingsKeys.length)];

    return PasswordSettings[setting]
}

function chooseRandomIndex() {
    const setting = chooseRandomSetting();
    return setting[randomNumber(setting.length)];
}

function generatePassword() {
    const passwdLengthFromEl = document.getElementById("passwd-length")
    let passwdLength = parseInt(passwdLengthFromEl.defaultValue);

    if (parseInt(passwdLengthFromEl.value) >= 8 && parseInt(passwdLengthFromEl.value) <= 100) {
        passwdLength = parseInt(passwdLengthFromEl.value)
    }

    let password = [];
    for (let i = 0; i < passwdLength; i++) {
        password.push(chooseRandomIndex());
    }

    return password.join("");
}

const generatePasswordEl = document.getElementById("generate-passwd");
generatePasswordEl.addEventListener("click", () => {
    const firstGeneratedEl = document.getElementById("first-generated");
    const secondGeneratedEl = document.getElementById("second-generated");

    firstGeneratedEl.textContent = generatePassword();
    secondGeneratedEl.textContent = generatePassword();

    // select text on click and copy to clipboard
    const passwords = document.getElementById("passwords").children;
    for (let i = 0; i < passwords.length; i++) {
        passwords[i].addEventListener("click", (e) => {
            const selection = window.getSelection();
            selection.removeAllRanges();

            const range = document.createRange();
            range.selectNodeContents(e.target);
            selection.addRange(range);

            navigator.clipboard.writeText(e.target.textContent);
        })
    }
})
