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
const colorOverlay = document.querySelector(".color-overlay");
// ===TIME DATA===
let pomodoro = 25;
let shortBreak = 5;
let longBreak = 10;
let MINUTE = 60;
let timeCountdown = pomodoro*MINUTE;
let x;
let timerLog = [];
let counting = false;
let currentTimer = 1;
const timerOrder = ["pomodoro", "short-break", "pomodoro", "short-break", "pomodoro", "short-break", "pomodoro", "long-break"];
let timerValues = {
  "pomodoro": pomodoro,
  "long-break": longBreak,
  "short-break": shortBreak
}
// ===Settings DATA===
let isOnTitle = false;
let isOnNotifications = false;
let isOnAutoStart = false;
let soundSelection = "sound-1";
let cookieObj = {};
let tones = {
  "sound-1": new Audio("audio/sound-1.mp3"),
  "sound-2": new Audio("audio/sound-2.mp3"),
  "sound-3": new Audio("audio/sound-3.mp3"),
  "sound-4": new Audio("audio/sound-4.mp3"),
}
let currentCountdown = "pomodoro";
// UPDATE VALUES
const updateTimerValues = function() {
  timerValues = {
    "pomodoro": pomodoro,
    "long-break": longBreak,
    "short-break": shortBreak
  }
}
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
  if(isOnNotifications) {
    const icon = "./images/wall-clock.png";
    const body = `${message}`;
    const notification = new Notification("Your time is up!", {body: body, icon: icon});
    tones[`${soundSelection}`].play();
    notification.addEventListener("click", () => {
      notification.close();
      window.parent.focus();
    });
  }
};

// ====FUNCTIONALITY====

// DATA MANAGMENT
function line(newValue, arr) {
  if (timerLog.length > 0) {
    arr.pop();
  }
  arr.push(newValue);
};

// Get cookies local data
function getCookiesData() {
  pomodoro = Number(cookieObj.pomodoro);
  shortBreak = Number(cookieObj.shortBreak);
  longBreak = Number(cookieObj.longBreak);
  isOnTitle = cookieObj.isOnTitle === "true";
  isOnNotifications = cookieObj.isOnNotifications === "true";
  isOnAutoStart = cookieObj.isOnAutoStart === "true";
  soundSelection = cookieObj.soundSelection;
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
    counting = true;
    let timeInSecs = time*60;
    if (timerLog.length > 0) {
      timeInSecs = timerLog[0];
    }
    displayMinSec(timeInSecs);
    line(timeInSecs, timerLog);
    timeInSecs--;
    
    x = setInterval(() => {
      const time = displayMinSec(timeInSecs);
      line(timeInSecs, timerLog);
      timeInSecs--;

      if (isOnTitle) {
        titleTimer.textContent = `Pomodoro Timer | ${time[0]}:${time[1]}`;
      } else {
        titleTimer.textContent = `Pomodoro Timer`;
      }
      if (timeInSecs <= -1) {
        clearInterval(x);
        if (isOnAutoStart) {
          nextTimer(`${timerOrder[currentTimer]}`);  
        } else {
          updateTimerValues();
          __resetTimer(timerValues[`${currentCountdown}`]);
          displayTimerNotification("")
        }
      }
    }, 1000)
  }
}

function nextTimer(nextTime) {
  if (timerOrder.length-1 === currentTimer) {
    currentTimer = 0;
  } else {
    currentTimer++;
  }
  switch(nextTime) {
    case "pomodoro":
      displayTimerNotification("Time to get your things done!");
      __resetTimer(pomodoro);
      startTimer(pomodoro);
      break;
    case "short-break":
      displayTimerNotification("Time to rest..");
      __resetTimer(shortBreak);
      startTimer(shortBreak);
      break;
    case "long-break":
      displayTimerNotification("Time to rest more..");
      __resetTimer(longBreak);
      startTimer(longBreak);
      break;
  } 
};
// BTNS FUNCTIONS
function resetTimer(time) {
  timerLog = [];
  clearInterval(x);
  displayMinSec(time*60);
  counting = false;  
  currentTimer = 0;
};

function __resetTimer(time) {
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
  pomodoro = Math.trunc(Number(pomodoroTime.value));
  shortBreak = Math.trunc(Number(shortTime.value));
  longBreak = Math.trunc(Number(longTime.value));
  if (pomodoro < 1 || pomodoro > 59) pomodoro = 1;
  if (shortBreak < 1 || shortBreak > 59) shortBreak = 1;
  if (longBreak < 1 || longBreak > 59) longBreak = 1;
  setSelection();
  UpdateSettingsValuesDisplay();
  setLocalData();
  if (!counting) {
    displayMinSec(pomodoro*60);
  }
  settingsWindow.classList.toggle("hidden");
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

function closeModalWindow() {
  settingsWindow.classList.toggle("hidden");
} 
// ====EVENT LISTENERS====
settingsBtn.addEventListener("click", () => {
  closeModalWindow()
});

startTimerBtn.addEventListener("click",() => {
  startTimer(pomodoro);
});

pauseTimerBtn.addEventListener("click", pauseTimer);

resetTimerBtn.addEventListener("click", () => {
  titleTimer.textContent = `Pomodoro Timer`;
  resetTimer(timerValues[`${currentCountdown}`]);
})

pomodoroBtn.addEventListener("click", () => {
  currentCountdown = "pomodoro";
  resetTimer(pomodoro);
  startTimer(pomodoro);
})

shortBreakBtn.addEventListener("click", () => {
  currentCountdown = "short-break";
  resetTimer(shortBreak);
  startTimer(shortBreak);
});

longBreakBtn.addEventListener("click", () => {
  currentCountdown = "long-break";
  resetTimer(longBreak);
  startTimer(longBreak);
});

closeBtn.addEventListener("click", () => {
  closeModalWindow()

})

saveBtn.addEventListener("click", applySettings);

colorOverlay.addEventListener("click", () => {
  closeModalWindow();
});

document.addEventListener("keydown", x => {
  if (x.code === "Escape" && !settingsWindow.classList.contains("hidden")) {
    closeModalWindow();
  }
})

displayMinSec(pomodoro*60);

// Notifications
// Auto pomodoro
