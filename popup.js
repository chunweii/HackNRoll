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

let port = chrome.runtime.connect({name: "timer"});

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

startButton.onclick = function startTimer() {
    port.postMessage({timer : "start"});
}

stopButton.onclick = function stopTimer() {
    port.postMessage({ timer: "stop" });
}

resetButton.onclick = function resetTimer() {
    port.postMessage({timer : "reset"})
    hours.innerText = '00';
    minutes.innerText = '00';
    seconds.innerText = '00';
}

function pad(number) {
    return (number < 10) ? '0' + number : number;
}

function stopwatchUpdate(newTime) {
    const numberOfHours = Math.floor(newTime/3600);
    const numberOfMinutes = Math.floor((newTime % 3600)/60);
    const numberOfSeconds = Math.floor(newTime % 60);
    hours.innerText = pad(numberOfHours);
    minutes.innerText = pad(numberOfMinutes);
    seconds.innerText = pad(numberOfSeconds);
}

port.onMessage.addListener(
    function (message) {
        if (message.newTime) {
            stopwatchUpdate(message.newTime);
        }
        else if (message.warning == "tab closing") {
            port.disconnect();
        }
    }
)

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.warning == "blacklist") {
        startButton.click();
        sendResponse({farewell: "black start"});
    } else if (request.warning == "whitelist") {
        stopButton.click();
        sendResponse({farewell: "white end"});
    }
  }
);