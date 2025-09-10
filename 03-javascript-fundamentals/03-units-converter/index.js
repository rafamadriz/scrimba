const length = 3.281;
const volume = 0.264;
const mass = 2.204;

const valueTo = document.getElementById("input-unit");
const convertBtn = document.getElementById("convert-btn");

function toLength(unit) {
  const toMeter = unit / length;
  const toFeet = unit * length;
  return { meters: toMeter, feet: toFeet };
}

function toVolume(unit) {
  const toLiters = unit / volume;
  const toGallons = unit * volume;
  return { liters: toLiters, gallons: toGallons };
}

function toMass(unit) {
  const toKilogram = unit / mass;
  const toPound = unit * mass;
  return { kilos: toKilogram, pounds: toPound };
}

function renderResults(unit) {
  const feet = toLength(unit).feet.toFixed(3);
  const meters = toLength(unit).meters.toFixed(3);

  const gallons = toVolume(unit).gallons.toFixed(3);
  const liters = toVolume(unit).liters.toFixed(3);

  const pounds = toMass(unit).pounds.toFixed(3);
  const kilos = toMass(unit).kilos.toFixed(3);

  const resultsEl = document.getElementById("results");
  for (let result of resultsEl.children) {
    result = result.children[1];
    if (result.id === "length") {
      result.innerHTML = `
                ${unit} meters = ${feet} feet | ${unit} feet = ${meters} meters
            `;
    }
    if (result.id === "volume") {
      result.innerHTML = `
                ${unit} liters = ${gallons} gallons | ${unit} gallons = ${liters} liters
            `;
    }
    if (result.id === "mass") {
      result.innerHTML = `
                ${unit} kilos = ${pounds} pounds | ${unit} pounds = ${kilos} kilos
            `;
    }
  }
}

convertBtn.addEventListener("click", () => {
  const unit = Number(valueTo.value);
  if (unit <= 0) {
    return;
  }

  renderResults(unit);
});
