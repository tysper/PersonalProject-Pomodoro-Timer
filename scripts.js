"use strict"

// ====ELEMENTS====
// Main Screen
const secsDisplay = document.querySelector(".seconds-display");
const minsDisplay = document.querySelector(".minutes-display");
const startTimerBtn = document.querySelector(".start-timer-btn");
const pauseTimerBtn = document.querySelector(".pause-timer-btn");
const resetTimerBtn = document.querySelector(".reset-timer-btn");
const pomodoroBtn = document.querySelector(".pomodoro-time"); 
const shortBreakBtn = document.querySelector(".short-break-time"); 
const longBreakBtn = document.querySelector(".long-break-time");
// Settings
const settingsBtn = document.querySelector(".settings-btn");
const settingsWindow = document.querySelector(".settings-window");
const closeBtn = document.querySelector(".close-btn");

// ===TIME DATA===
let pomodoro = 0.5  ;
let shortBreak = 5;
let longBreak = 10;
let MINUTE = 60;
let timeCountdown = pomodoro*MINUTE;
let x;
let timerLog = [];
let counting = false;
// ====INIT====
if (Notification.permission === "default") {
  Notification.requestPermission();
};

const displayTimerNotification = (message) => {
  const icon = "";
  const body = `Time to ${message}`;
  const notification = new Notification("The time is up!", {body, icon});
  notification.addEventListener("click", () => {
    notification.close();
    window.parent.focus();
  });
};

// ====FUNCTIONALITY====
const line = newValue => {
  if (timerLog.length > 0) {
    timerLog.pop();
  }
  timerLog.push(newValue);
};

const displayMinSec = secs => {
  const inMin = Math.floor(secs/60).toString().padStart(2, "0");
  const inSecs = (secs%60).toString().padStart(2, "0");
  minsDisplay.textContent = inMin;
  secsDisplay.textContent = inSecs;
};

const startTimer = (time) => {
  if (!counting) {

    let timeInSecs = time*60;
    if (timerLog.length > 0) {
      timeInSecs = timerLog[0];
    }
    displayMinSec(timeInSecs);
    line(timeInSecs);
    timeInSecs--;
    
    x = setInterval(() => {
      displayMinSec(timeInSecs);
      line(timeInSecs);
      timeInSecs--;
      if (timeInSecs === -1) {
        clearInterval(x);

      }
    }, 1000)
  } else {
    console.log("already started a timer")
  }
}

const resetTimer = (time) => {
  timerLog = [];
  clearInterval(x);
  displayMinSec(time*60);
  counting = false;  
};

const pauseTimer = () => {
  clearInterval(x);
  counting = false;
};

// ====EVENT LISTENERS====
settingsBtn.addEventListener("click", () => {
  settingsWindow.classList.remove("hidden");
});

startTimerBtn.addEventListener("click",() => {
  startTimer(pomodoro);
  counting = true;
});

pauseTimerBtn.addEventListener("click", pauseTimer);

resetTimerBtn.addEventListener("click", () => {debugger; resetTimer(pomodoro)})

pomodoroBtn.addEventListener("click", () => {
  resetTimer(pomodoro);
  startTimer(pomodoro);
})

shortBreakBtn.addEventListener("click", () => {
  resetTimer(shortBreak);
  startTimer(shortBreak);
});

longBreakBtn.addEventListener("click", () => {
  resetTimer(longBreak);
  startTimer(longBreak);
});

closeBtn.addEventListener("click", () => {
  settingsWindow.classList.toggle("hidden");
})

// I have to:
// Set the notification tracking system
// Set the custom notification
// Make the settings work
