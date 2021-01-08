window.blacklist = [
    /^https:\/\/www\.youtube\.com\/watch\?v=/,
    /^https:\/\/www\.reddit\.com/
];
window.whitelist=[];

fakeData = {
    "time": 69
}
window.time = fakeData["time"]
let isRunning = false;
let interval;
let state = {
    "time": 69
}

// handles saving to json file
let timerHandler = {
    set: function(obj, prop, value) {
      if (prop === 'time') {
          obj[prop] = value
          console.log("state change" + state["time"])
          window.time = state["time"] //update window
          fakeData["time"] = value; //to sub with chrome storage
          chrome.runtime.sendMessage({
            msg: "time", 
            data: {
                time: state["time"]
            }
        });
      }
      return true;
    }
}
state = new Proxy(state, timerHandler);

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({whitelistOfPlaylists: []});

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        // current session
        chrome.declarativeContent.onPageChanged.addRules([{
            // which pages our extension is available in
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'www.youtube.com' }, 
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info =>{
        for(let i = 0; i < window.blacklist.length; i = i + 1){
            if (window.blacklist[i].test(current_tab_info.url)){ 
                // checks if tab is in blacklist and executes handleBlacklist.js
                // chrome.tabs.executeScript(null, {file: './handleBlacklist.js'}, () => console.log("handling blacklist"));
                handleBlacklist();
                return;
            } 
        }
        return handleWhiteList();
    });
})

function handleBlacklist(){
    console.log("handling blacklist");
    function startTimer() {
        if(!isRunning){
            console.log("start timer")
            interval  = setInterval(incrementTimer, 1000);
            isRunning = true;
        }
    }
    function incrementTimer() {
        state["time"] = state["time"] + 1;
    }
    // function resetTimer() {
    //     bg.timerTime = 0;
    // }
    
    startTimer();
}

function handleWhiteList(){
    console.log("handling whitelist")
    function stopTimer() {
        if(isRunning){
            console.log("stop timer")
            clearInterval(interval);
            isRunning = false;
        }
    }
    stopTimer();
}