const bg = chrome.extension.getBackgroundPage()
// bg variables: isRunning, timerTime
let addToWhitelist = document.getElementById('addToWhitelist');
let clearButton = document.getElementById('clearButton');
let startButton = document.getElementById('startButton');
let stopButton = document.getElementById('stopButton');
let resetButton = document.getElementById('resetButton');
let hours = document.querySelector('.hours');
let minutes = document.querySelector('.minutes');
let seconds = document.querySelector('.seconds');

document.addEventListener('DOMContentLoaded', ()=>{
    setTimer(bg.time);
})

// handles changes to timerTime in stopwatch of widget
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "time") {
            console.log("update time")
            setTimer(request.data.time);
        }
    }
);

function setTimer(data){
    hours.innerText = pad(Math.floor(data/3600));
    minutes.innerText = pad(Math.floor((data % 3600)/60));
    seconds.innerText = pad(data % 60);
}

addToWhitelist.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let query = (new URL(tabs[0].url)).searchParams.get("list");
        if (query === "") {
            addToWhitelist.innerText = "No Playlist";
        } else {
            chrome.storage.sync.get("whitelistOfPlaylists", (items) => {
                if (items.whitelistOfPlaylists.includes(query)) {
                    addToWhitelist.innerText = "Playlist exists on whitelist.";
                    return;
                }
                chrome.storage.sync.set({ whitelistOfPlaylists: [...items.whitelistOfPlaylists, query]}, () => {
                    addToWhitelist.innerText = "Playlist is added";
                });
            });
            
        }
        chrome.storage.sync.get(null, (items) => {
            console.log(items);
        });
    });
    
};

clearButton.onclick = function (element) {
    chrome.storage.sync.set({whitelistOfPlaylists: []}, () => {
        console.log("Cleared.");
    });
}

// startButton.onclick = function startTimer() {
//     if (isRunning) return;
//     isRunning = true;
//     interval  = setInterval(incrementTimer, 1000);
// }

// stopButton.onclick = function stopTimer() {
//     if (!isRunning) return;
//     isRunning = false;
//     clearInterval(interval);
// }

resetButton.onclick = function resetTimer() {
    bg.timerTime = 0;
    hours.innerText = '00';
    minutes.innerText = '00';
    seconds.innerText = '00';
}

function pad(number) {
    return (number < 10) ? '0' + number : number;
}








// function incrementTimer() {
//     if (bg.timerTime == 86399) {
//         bg.timerTime = 0;
//         alert("24 hours have passed. Please restart your timer");
//         stopButton.click();
//         resetButton.click();
//     } else {
//         bg.timerTime++;
//     }   
//     const numberOfHours = Math.floor(bg.timerTime/3600);
//     const numberOfMinutes = Math.floor((bg.timerTime % 3600)/60);
//     const numberOfSeconds = bg.timerTime % 60;
//     hours.innerText = pad(numberOfHours);
//     minutes.innerText = pad(numberOfMinutes);
//     seconds.innerText = pad(numberOfSeconds);
// }
