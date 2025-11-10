// -------------------------
// ELEMENTI UI
// -------------------------
const focusComponent = document.getElementById("focus-container");
const breakComponent = document.getElementById("break-container");
const longBreakComponent = document.getElementById("longBreak-container");

const containerBtns = document.getElementById("container-buttons");
const containerChanges = document.getElementById("container-changes");
const containerCountdwn = document.getElementById("container-countdown");

const minsText = document.getElementById("minutes");
const secText = document.getElementById("seconds");

const focusBtn = document.getElementById("focus-status");
const breakBtn = document.getElementById("break-status");
const longBreakBtn = document.getElementById("longBreak-status");

const playButton = document.getElementById("play");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

// -------------------------
// VARIABILI GLOBALI
// -------------------------
let interval = null;
let totalSeconds = 0;

const state = {
  pre: "focus",
  active: "focus",
  focus: 1,
  break: 1,
  longBreak: 30,
  count: 0,
};

// -------------------------
// INIT
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  showMode("focus");
  containerBtns.style.display = "block";
  containerChanges.style.display = "block";
  containerCountdwn.style.display = "none";
});

// -------------------------
// CAMBIO MODALITÀ
// -------------------------
focusBtn.addEventListener("click", () => setMode("focus"));
breakBtn.addEventListener("click", () => setMode("break"));
longBreakBtn.addEventListener("click", () => setMode("longBreak"));

function setMode(mode) {
  state.pre = state.active;
  state.active = mode;
  showMode(mode);
}

function showMode(mode) {
  focusComponent.style.display = mode === "focus" ? "block" : "none";
  breakComponent.style.display = mode === "break" ? "block" : "none";
  longBreakComponent.style.display = mode === "longBreak" ? "block" : "none";
}

// -------------------------
// INCREMENTI / DECREMENTI
// -------------------------
document.querySelectorAll(".increment").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById(btn.dataset.target);
    const key = target.dataset.key;

    state[key]++;
    target.innerText = state[key];
  });
});

document.querySelectorAll(".decrement").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById(btn.dataset.target);
    const key = target.dataset.key;
    const min = parseInt(target.dataset.min);

    if (state[key] > min) {
      state[key]--;
      target.innerText = state[key];
    }
  });
});

// -------------------------
// PLAY
// -------------------------
playButton.addEventListener("click", (e) => {
  e.preventDefault();

  // Evita doppio intervallo
  if (interval !== null) return;

  // Se cambio modalità o totalSeconds è 0 → ricalcolo
  if (totalSeconds === 0 || state.pre !== state.active) {
    totalSeconds = state[state.active] * 60;
  }

  // Mostra countdown
  containerBtns.style.display = "none";
  containerChanges.style.display = "none";
  containerCountdwn.style.display = "block";

  // Aggiorna subito senza delay
  updateDisplay();

  // Avvia timer
  interval = setInterval(() => {
    if (totalSeconds <= 0) {
      handleEndOfCycle();
      return;
    }

    totalSeconds--;
    updateDisplay();
  }, 1000);
});

// -------------------------
// STOP (PAUSA)
// -------------------------
stopBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
});

// -------------------------
// RESET
// -------------------------
resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  reset();
});

function reset() {
  clearInterval(interval);
  interval = null;

  totalSeconds = 0;
  state.pre = state.active;
  state.active = "focus";
  state.count = 0;

  showMode("focus");

  containerBtns.style.display = "block";
  containerChanges.style.display = "block";
  containerCountdwn.style.display = "none";
}

// -------------------------
// UPDATE UI COUNTDOWN
// -------------------------
function updateDisplay() {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  minsText.innerText = minutes;
  secText.innerText = seconds.toString().padStart(2, "0");
}

// -------------------------
// LOGICA CICLO (focus → break → longBreak → reset)
// -------------------------
function handleEndOfCycle() {
  if (state.active === "focus") {
    state.pre = "focus";
    state.active = "break";
    totalSeconds = state.break * 60;
  } else if (state.active === "break") {
    state.count++;
    if (state.count >= 4) {
      state.pre = "break";
      state.active = "longBreak";
      totalSeconds = state.longBreak * 60;
    } else {
      state.pre = "break";
      state.active = "focus";
      totalSeconds = state.focus * 60;
    }
  } else {
    reset();
  }

  updateDisplay();
}
