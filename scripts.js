"use strict"
const timeDisplay = document.querySelector(".time-display");

let timer;
let timerLog = [];
let countdownLog = [];
let isCounting = false;

// Time length
let pomodoro = 1500;
let shortBreak = 300;
let longBreak = 600;


function nextOnLine(arr, el) {
  const line = arr.slice();
  line.pop();
  line.push(el);
  return line;
}

function toHoursMinutes(secs) {
  const minutes = Math.floor(secs/60);
  const seconds = secs%60;

  return [minutes, seconds];
}

function displayTime(secs) {
  const [min, seconds] = toHoursMinutes(secs).map(x => (x+"").padStart(2, "0"));
  timeDisplay.textContent = `${min}:${seconds}`;
}

function startTimer(time) {
  if (!isCounting) {

    countdownLog = nextOnLine(countdownLog, time);
    let countdown = time;
    let currentTime;

    isCounting = true;
    
    if (timerLog.length > 0) {
      currentTime = timerLog[0];
    } else {
      currentTime = time;
    };
    
    if (countdownLog.length > 0) {
      countdown = countdownLog[0];
    }
    

    function updateCountdown(varName) {
      if (currentTime > -1) {
        displayTime(currentTime);
        currentTime--;
        timerLog = nextOnLine(timerLog, currentTime);
      } else {
        resetTimer(varName);
        return "stopped";
      }
    }
    
    updateCountdown(timer);
    
    timer = setInterval(function() {
      updateCountdown(timer);
    }, 1000);

    return countdown;
  } else {
    return "countdown already started";
  }
}

function stopTimer(timerName) {
  clearInterval(timerName);
  isCounting = false;
}

function resetTimer(timerName) {
  timerLog.pop();
  stopTimer(timerName)
  displayTime(countdownLog[0]);
}

// DOM
const startBtn = document.querySelector(".start-timer-btn");
const stopBtn = document.querySelector(".pause-timer-btn");
const resetBtn = document.querySelector(".reset-timer-btn");
const pomoBtn = document.querySelector(".pomodoro-time");
const shortBtn = document.querySelector(".short-break-time");
const longBtn = document.querySelector(".long-break-time");

startBtn.addEventListener("click", _ => {
  startTimer(pomodoro);
});
stopBtn.addEventListener("click", _ => {
  stopTimer(timer);
});
resetBtn.addEventListener("click", _ => {
  resetTimer(timer);
});

pomoBtn.addEventListener("click", _ => {
  countdownLog = nextOnLine(countdownLog, pomodoro);
  resetTimer(timer);
  startTimer(pomodoro);
});

shortBtn.addEventListener("click", _ => {
  countdownLog = nextOnLine(countdownLog, pomodoro);
  resetTimer(timer);
  startTimer(shortBreak);
});

longBtn.addEventListener("click", _ => {
  countdownLog = nextOnLine(countdownLog, pomodoro);
  resetTimer(timer);
  startTimer(longBreak);
});