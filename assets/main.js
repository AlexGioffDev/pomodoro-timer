// Variables and constant
const btns = document.querySelectorAll(".btn");
const btnsIncrement = document.querySelectorAll(".increment");
const btnsDecrement = document.querySelectorAll(".decrement");
const minutesText = document.getElementById("minutes");
const secondsText = document.getElementById("seconds");
let countdownEle = document.getElementById("countdown");
let buttonsContainer = document.querySelector(".buttons-container");
const circles = document.getElementsByClassName("circle");

// start buttons
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let state = {
  preValue: "focus",
  value: "focus",
  count: 0,
};

let interval = null;
let totalSeconds = 0;

startBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let timerActiveEle = document.querySelector(".timer-active");
  timerActiveEle.classList.remove("timer-active");
  countdownEle.classList.add("timer-active");

  buttonsContainer.classList.add("buttons-hiden");

  if (state.value !== "pause") {
    if (interval) return;

    let valueElement = parseInt(
      document.getElementById(`focus-value`).innerHTML
    );

    totalSeconds = valueElement * 60;
  } else {
    state.value = state.preValue;
  }
  startCountdown();

  interval = setInterval(() => {
    totalSeconds--;
    if (totalSeconds == 0) {
      switch (state.value) {
        case "focus":
          state.count++;
          updateCircle();
          changeState();
          state.preValue = "focus";

          if (state.value === "break") {
            totalSeconds = parseInt(
              document.getElementById("break-value").innerHTML * 60
            );
          } else if (state.value === "longBreak") {
            totalSeconds = parseInt(
              document.getElementById("longBreak-value").innerHTML * 60
            );
          }
          // Rimosso il blocco else { reset(); return; }
          break;

        case "break":
          state.preValue = "break";
          changeState(); // -> state.value = "focus"
          totalSeconds = parseInt(
            document.getElementById("focus-value").innerHTML * 60
          );
          break;

        case "longBreak":
          state.preValue = "longBreak"; // Non strettamente necessario qui, ma non fa male
          reset();
          return; // FERMA L'INTERVALLO E IL CICLO SUBITO DOPO IL RESET
      }
    }
    startCountdown();
  }, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(interval);
  state.value = "pause";
});

resetBtn.addEventListener("click", () => {
  reset();
});

/**
 * Function that change the value of the state
 */
function changeState() {
  switch (state.value) {
    case "focus":
      if(state.count === 4)
      {
        state.value = "longBreak";
      } else {
        state.value = "break";
      }
      break;
    case "break":
      state.value = "focus";
      break;
    case "longBreak":
      state.value = "focus";
      break;
  }
}

function updateCircle() {
  Array.from(circles).forEach((el, index) => {
    if (index < state.count) {
      el.classList.add("circle-full");
    } else {
      return;
    }
  });
}

function startCountdown() {
  minutesText.innerText = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  secondsText.innerText = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
}

btnsIncrement.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const dataTarget = e.currentTarget.dataset["key"];
    const target = document.getElementById(`${dataTarget}-value`);
    const newValue = parseInt(target.innerText) + 1;
    target.innerText = newValue;
  });
});

btnsDecrement.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const dataTarget = e.currentTarget.dataset["key"];
    const target = document.getElementById(`${dataTarget}-value`);
    let newValue = parseInt(target.innerText) - 1;
    if (newValue < 1) newValue = 1;
    target.innerText = newValue;
  });
});

for (let btn of btns) {
  btn.addEventListener("click", (e) => {
    const active = document.querySelector(".btn-active");
    if (active) active.classList.remove("btn-active");

    e.preventDefault();
    const idTarget = e.target.dataset["name"];
    let targetTimer = document.getElementById(`${idTarget}-target`);
    const timerActive = document.querySelector(".timer-active");
    if (timerActive) timerActive.classList.remove("timer-active");
    targetTimer.classList.add("timer-active");
    e.target.classList.add("btn-active");
  });
}

function reset() {
  clearInterval(interval);
  interval = null;

  state = { preValue: "focus", value: "focus", count: 0 };
  totalSeconds = 0;

  document.getElementById("focus-value").innerText = 25;
  document.getElementById("break-value").innerText = 5;
  document.getElementById("longBreak-value").innerText = 30;

  document
    .querySelectorAll(".timer-active")
    .forEach((el) => el.classList.remove("timer-active"));

  document.getElementById("focus-target").classList.add("timer-active");

  buttonsContainer.classList.remove("buttons-hiden");
  document
    .querySelectorAll(".btn-active")
    .forEach((el) => el.classList.remove("btn-active"));
  btns[0].classList.add("btn-active");

  Array.from(circles).forEach((circle) =>
    circle.classList.remove("circle-full")
  );

  minutesText.innerText = ""
  secondsText.innerText = "";
}
