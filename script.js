    let is24Hour = JSON.parse(localStorage.getItem("is24Hour")) ?? true;
let isLightMode = JSON.parse(localStorage.getItem("isLightMode")) ?? false;
let stopwatchTime = parseInt(localStorage.getItem("stopwatchTime")) || 0;
let stopwatchInterval = null;
let alarms = JSON.parse(localStorage.getItem("alarms")) || [];

function pad(n) {
  return n < 10 ? "0" + n : n;
}

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  setBackground(hours);

  let displayHours = hours;
  let ampm = "";
  if (!is24Hour) {
    ampm = hours >= 12 ? " PM" : " AM";
    displayHours = hours % 12 || 12;
  }

  const timeString = `${pad(displayHours)}:${pad(minutes)}:${pad(seconds)}${ampm}`;
  document.getElementById("clock").textContent = timeString;
  document.getElementById("date").textContent = now.toDateString();

  checkAlarms(`${pad(hours)}:${pad(minutes)}`);
}

function toggleFormat() {
  is24Hour = !is24Hour;
  localStorage.setItem("is24Hour", JSON.stringify(is24Hour));
  updateClock();
}

function toggleTheme() {
  isLightMode = !isLightMode;
  localStorage.setItem("isLightMode", JSON.stringify(isLightMode));
  applyTheme();
}

function setBackground(hours) {
  if (isLightMode) return;
  document.body.classList.remove("morning", "day", "night");
  if (hours >= 5 && hours < 12) document.body.classList.add("morning");
  else if (hours >= 12 && hours < 18) document.body.classList.add("day");
  else document.body.classList.add("night");
}

function applyTheme() {
  document.body.classList.toggle("light", isLightMode);
  updateClock();
}

// Stopwatch
function startStopwatch() {
  if (stopwatchInterval) return;
  stopwatchInterval = setInterval(() => {
    stopwatchTime++;
    localStorage.setItem("stopwatchTime", stopwatchTime);
    updateStopwatch();
  }, 1000);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}

function resetStopwatch() {
  stopwatchTime = 0;
  localStorage.setItem("stopwatchTime", stopwatchTime);
  updateStopwatch();
  stopStopwatch();
  document.getElementById("laps").innerHTML = "";
}

function updateStopwatch() {
  const h = Math.floor(stopwatchTime / 3600);
  const m = Math.floor((stopwatchTime % 3600) / 60);
  const s = stopwatchTime % 60;
  document.getElementById("stopwatch").textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function recordLap() {
  const lap = document.createElement("li");
  lap.textContent = document.getElementById("stopwatch").textContent;
  document.getElementById("laps").appendChild(lap);
}

// Alarm
function setAlarm() {
  const time = document.getElementById("alarmTime").value;
  if (!time || alarms.includes(time)) return;
  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  renderAlarms();
}

function renderAlarms() {
  const ul = document.getElementById("alarms");
  ul.innerHTML = "";
  alarms.forEach((alarm, i) => {
    const li = document.createElement("li");
    li.textContent = alarm + " ";
    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.onclick = () => {
      alarms.splice(i, 1);
      localStorage.setItem("alarms", JSON.stringify(alarms));
      renderAlarms();
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function checkAlarms(currentTime) {
  if (alarms.includes(currentTime)) {
    document.getElementById("alarmSound").play();
    alarms = alarms.filter(t => t !== currentTime);
    localStorage.setItem("alarms", JSON.stringify(alarms));
    renderAlarms();
  }
}

// INIT
applyTheme();
renderAlarms();
updateStopwatch();
setInterval(updateClock, 1000);
updateClock();