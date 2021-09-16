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
const titleTimer = document.querySelector(".timer-on-title");
// Settings
const settingsBtn = document.querySelector(".settings-btn");
const settingsWindow = document.querySelector(".settings-window");
const closeBtn = document.querySelector(".close-btn");

// Settings Values
let timerOnTitleValue = document.querySelector("#title-indicator");
let browserNotificationsValue = document.querySelector("#show-notifications");  
let autoStartPomodorosValue = document.querySelector("#auto-start-timer");
let soundOptionsValue = document.querySelectorAll(".option-btn");
let selectedOption = document.querySelector(".list-select-input");
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
let cookieObj = {};

const cookies = document.cookie.split(";").map(x => x.trim());
cookies.forEach((x) => {
  const data = x.split("=");
  cookieObj[`${data[0]}`] = data[1]
});

if (document.cookie.length > 0) {
  getCookiesData();
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

// DATA MANAGMENT
function line(newValue) {
  if (timerLog.length > 0) {
    timerLog.pop();
  }
  timerLog.push(newValue);
};

function getCookiesData() {
  pomodoro = Number(cookieObj.pomodoro);
  shortBreak = Number(cookieObj.shortBreak);
  longBreak = Number(cookieObj.longBreak);
  isOnTitle = cookieObj.isOnTitle === "true";
  isOnNotifications = cookieObj.isOnNotifications === "true";
  isOnAutoStart = cookieObj.isOnAutoStart === "true";
  soundSelection = cookieObj.soundSelection;
  // console.log(isOnTitle);
  // console.log(isOnNotifications);
  // console.log(soundSelection);
  // console.log(isOnAutoStart);
  // console.log(pomodoro);
  // console.log(shortBreak);
  // console.log(longBreak);
  UpdateSettingsValuesDisplay();
};

// TIMER ITSELF
function displayMinSec(secs) {
  const inMin = Math.floor(secs/60).toString().padStart(2, "0");
  const inSecs = (secs%60).toString().padStart(2, "0");
  minsDisplay.textContent = inMin;
  secsDisplay.textContent = inSecs;
  return [inMin, inSecs];
};

function startTimer(time) {
  if (!counting) {

    let timeInSecs = time*60;
    if (timerLog.length > 0) {
      timeInSecs = timerLog[0];
    }
    displayMinSec(timeInSecs);
    line(timeInSecs);
    timeInSecs--;
    
    x = setInterval(() => {
      const time = displayMinSec(timeInSecs);
      line(timeInSecs);
      timeInSecs--;
      if (isOnTitle) {
        titleTimer.textContent = `Pomodoro Timer | ${time[0]}:${time[1]}`;
      } else {
        titleTimer.textContent = "Pomodoro Timer";
      };
      if (timeInSecs === -1) {
        clearInterval(x);
        
      }
    }, 1000)
  } else {
    console.log("already started a timer")
  }
}

// BTNS FUNCTIONS
function resetTimer(time) {
  timerLog = [];
  clearInterval(x);
  displayMinSec(time*60);
  counting = false;  
};

function pauseTimer() {
  clearInterval(x);
  counting = false;
};

// Update settings display
function UpdateSettingsValuesDisplay() {
  timerOnTitleValue.checked = isOnTitle; 
  browserNotificationsValue.checked = isOnNotifications;
  selectedOption.value = soundSelection;
  autoStartPomodorosValue.checked = isOnAutoStart;
  pomodoroTime.value = pomodoro.toString();
  shortTime.value = shortBreak.toString();
  longTime.value = longBreak.toString();
};

// Gets settings from settings form
function applySettings() {
  isOnTitle = timerOnTitleValue.checked;
  isOnNotifications = browserNotificationsValue.checked;
  isOnAutoStart = autoStartPomodorosValue.checked;
  pomodoro = Number(pomodoroTime.value);
  shortBreak = Number(shortTime.value);
  longBreak = Number(longTime.value);
  setSelection();
  UpdateSettingsValuesDisplay();
  setLocalData();
  if (!counting) {
    displayMinSec(pomodoro*60);
  }
}

// Gets sound selection
function setSelection() {
  for (let i = 0; i < soundOptionsValue.length; i++) {
    if (soundOptionsValue[i].selected) {
      soundSelection = soundOptionsValue[i].value;
    };
  };
}

// Sets the data for the user
function setLocalData() {
  document.cookie = `pomodoro=${pomodoro}`;
  document.cookie = `shortBreak=${shortBreak}`;
  document.cookie = `longBreak=${longBreak}`;
  document.cookie = `isOnTitle=${isOnTitle}`;
  document.cookie = `isOnNotifications=${isOnNotifications}`;
  document.cookie = `isOnAutoStart=${isOnAutoStart}`;
  document.cookie = `soundSelection=${soundSelection}`;
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

displayMinSec(pomodoro*60);

// Notifications
// Auto pomodoro
// Sound

const notif = new Notification("Your time is up!", {body: "Time to study!", icon: "./images/wall-clock.png", actions: ["OK", "Start Break"]});