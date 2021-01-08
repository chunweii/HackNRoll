let addToWhitelist = document.getElementById('addToWhitelist');
let clearButton = document.getElementById('clearButton');
let startButton = document.getElementById('startButton');
let stopButton = document.getElementById('stopButton');
let resetButton = document.getElementById('resetButton');
let hours = document.querySelector('.hours');
let minutes = document.querySelector('.minutes');
let seconds = document.querySelector('.seconds');
let timerTime = 0;
let isRunning = false;
let interval;

addToWhitelist.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let query = (new URL(tabs[0].url)).searchParams.get("list");
        if (query === "") {
            addToWhitelist.innerText = "No Playlist";
        } else {
            chrome.storage.sync.set({[query] : 1}, () => console.log("Added " + query));
            addToWhitelist.innerText = "Playlist is added";
        }
        chrome.storage.sync.get(null, (items) => {
            console.log(items);
        });
    });
    
};

clearButton.onclick = function (element) {
    chrome.storage.sync.clear(() => {
        console.log("Cleared.");
        chrome.storage.sync.get(null, (items) => {
            console.log(items);
        });
    });
}

startButton.onclick = function startTimer() {
    if (isRunning) return;
    isRunning = true;
    interval  = setInterval(incrementTimer, 1000);
}

stopButton.onclick = function stopTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(interval);
}

resetButton.onclick = function resetTimer() {
    timerTime         = 0;
    minutes.innerText = '00';
    seconds.innerText = '00';
}

function pad(number) {
    return (number < 10) ? '0' + number : number;
}

function incrementTimer() {
    timerTime++;
    const numberOfHours = Math.floor(timerTime/3600);
    const numberOfMinutes = Math.floor((timerTime % 3600)/60);
    const numberOfSeconds = timerTime % 60;
    hours.innerText = pad(numberOfHours);
    minutes.innerText = pad(numberOfMinutes);
    seconds.innerText = pad(numberOfSeconds);
}
