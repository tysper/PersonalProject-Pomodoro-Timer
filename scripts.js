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

// Settings Values
let timerOnTitleValue = document.querySelector("#title-indicator");
let browserNotificationsValue = document.querySelector("#show-notifications");  
let autoStartPomodorosValue = document.querySelector("#auto-start-timer");
let soundOptionsValue = document.querySelectorAll(".option-btn");
let selectedOption = document.querySelector(".list-select-input").value;
let pomodoroTime = document.querySelector("#pomodoro-time");
let shortTime = document.querySelector("#short-break-time");
let longTime = document.querySelector("#long-break-time");

const saveBtn = document.querySelector(".save-btn");
const resetBtn = document.querySelector(".reset-btn");
// ===TIME DATA===
let pomodoro = 25;
let shortBreak = 5;
let longBreak = 10;
let MINUTE = 60;
let timeCountdown = pomodoro*MINUTE;
let x;
let timerLog = [];
let counting = false;

// ===Settings DATA===
let isOnTitle = true;
let isOnNotifications = true;
let isOnAutoStart = true;
let soundSelection = "sound-1";

if (localStorage.length > 0) {
  pomodoro = localStorage.pomodoro;
  shortBreak = localStorage.shortBreak;
  longBreak = localStorage.longBreak;
  isOnTitle = localStorage.isOnTitle;
  isOnNotifications = localStorage.isOnNotifications;
  isOnAutoStart = localStorage.isOnAutoStart;
  soundSelection = localStorage.soundSelection;
}

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

const UpdateSettingsValuesDisplay = () => {
  timerOnTitleValue.checked = isOnTitle; 
  browserNotificationsValue.checked = isOnNotifications;
  selectedOption = soundSelection;
  autoStartPomodorosValue.checked = isOnAutoStart;
  pomodoroTime.textContent = pomodoro;
  shortTime.textContent = shortBreak;
  longTime.textContent = longBreak;
};

const applySettings = () => {
  isOnTitle = timerOnTitleValue.checked;
  isOnNotifications = browserNotificationsValue.checked;
  isOnAutoStart = autoStartPomodorosValue.checked;
  pomodoro = Number(pomodoroTime.value);
  shortBreak = Number(shortTime.value);
  longBreak = Number(longTime.value);
  setSelection();
  UpdateSettingsValuesDisplay();
}

const setSelection = () => {
  for (let i = 0; i < soundOptionsValue.length; i++) {
    if (soundOptionsValue[i].selected) {
      soundSelection = soundOptionsValue[i].value;
    };
  };
}

const setLocalData = () => {

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

resetTimerBtn.addEventListener("click", () => {resetTimer(pomodoro)})

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

saveBtn.addEventListener("click", applySettings);

// Things I got to do:

// Setlocaldata
//  menu timer function
// notifications work
// song work
//  improve animations