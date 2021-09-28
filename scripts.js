"use strict";
const timeDisplay = document.querySelector(".time-display");

let counter;
let lastPaused = [];
let lastTimerRunning = [];

// Conditions for starting
let wasPaused = false;
let isRunning = false;
let wasReseted = false;
let fromDefinedBtns = false;

// Time length
let timeLength = {
  pomodoro: 1500,
  shortBreak: 300,
  longBreak: 600,
};

function timeOnDisplay(secs) {
  let minutes = Math.floor(secs / 60) + "",
    seconds = (secs % 60) + "";
  timeDisplay.textContent = `${minutes.padStart(2, "0")}:${seconds.padStart(
    2,
    "0"
  )}`;
  return secs;
}

// function updateLog(log, value) {
//   log.push(value);
//   return log.slice();
// }

function startTimer(time) {
  let countdown;
  if (wasReseted) {
    wasReseted = false;
    countdown = lastTimerRunning[lastTimerRunning.length - 1];
  } else if (wasPaused) {
    wasPaused = false;
    countdown = lastPaused[lastPaused.length - 1];
  } else if (isRunning) {
    console.log("Timer already started!");
    return false;
  } else {
    countdown = time;
  }

  if (fromDefinedBtns) {
    countdown = time;
  }

  isRunning = true;

  lastPaused.push(timeOnDisplay(countdown));
  countdown--;

  counter = setInterval(() => {
    lastPaused.push(timeOnDisplay(countdown));
    countdown--;

    if (countdown <= -1) {
      clearInterval(counter);
    }
  }, 1000);

  if (!wasPaused) {
    lastTimerRunning.push(time);
    return time;
  } else {
    return lastTimerRunning[lastTimerRunning.length - 1];
  }
}

function pauseCounter(timer) {
  clearInterval(timer);
  wasPaused = true;
  return timer;
}

function resetCounter(timer) {
  clearInterval(timer);
  wasPaused = false;
  isRunning = false;
  wasReseted = true;
  timeOnDisplay(lastTimerRunning[lastTimerRunning.length - 1]);
}

// DOM
const startBtn = document.querySelector(".start-timer-btn");
const pauseBtn = document.querySelector(".pause-timer-btn");
const resetBtn = document.querySelector(".reset-timer-btn");
const pomoBtn = document.querySelector(".pomodoro-time");
const shortBtn = document.querySelector(".short-break-time");
const longBtn = document.querySelector(".long-break-time");

const openSettingsBtn = document.querySelector(".settings-btn");
const closeSettingsBtn = document.querySelector(".close-btn");
const settingsWindow = document.querySelector(".settings-window");

//  Main frame
startBtn.addEventListener("click", (_) => {
  fromDefinedBtns = false;
  startTimer(timeLength.pomodoro);
});
pauseBtn.addEventListener("click", (_) => {
  pauseCounter(counter);
});
resetBtn.addEventListener("click", (_) => {
  resetCounter(counter);
});

pomoBtn.addEventListener("click", (_) => {
  fromDefinedBtns = true;
  startTimer(timeLength.pomodoro);
});

shortBtn.addEventListener("click", (_) => {
  fromDefinedBtns = true;
  startTimer(timeLength.shortBreak);
});

longBtn.addEventListener("click", (_) => {
  fromDefinedBtns = true;
  startTimer(timeLength.longBreak);
});

//  Settings frame
openSettingsBtn.addEventListener("click", () => {
  settingsWindow.classList.toggle("hidden");
});

closeSettingsBtn.addEventListener("click", () => {
  settingsWindow.classList.toggle("hidden");
});
