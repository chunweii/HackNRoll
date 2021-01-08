let interval;
const bg = chrome.extension.getBackgroundPage();
// bg variables: isRunning, timerTime

function startTimer() {
    interval  = setInterval(incrementTimer, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function resetTimer() {
    bg.timerTime = 0;
}


function incrementTimer() {
    if (bg.timerTime == 86399) {
        bg.timerTime = 0;
        alert("24 hours have passed. Please restart your timer");
        stopButton.click();
        resetButton.click();
    } else {
        bg.timerTime++;
    }   
}

startTimer();