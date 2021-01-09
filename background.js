// runs when extension installed
let startTime = 0;
let timeElapsed = 0;
let isStop = true;
window.youtubeTime = 0;
window.redditTime = 0;
window.blacklist = [
    /^https:\/\/www\.youtube\.com\/watch\?v=/,
    /^https:\/\/www\.reddit\.com/
];
window.whitelist=[];

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "timer");
    let counting = setInterval(() => {
                    if (!isStop) {
                        port.postMessage({ newTime: timeElapsed + (Date.now() - startTime) / 1000 })
                    }
                }, 1000);
    port.onMessage.addListener(function (message) {
        if (message.timer == "start") {
            if (!isStop) {}
            else {
                isStop = false;
                startTime = Date.now();
            }
        }
        else if (message.timer == "stop") {
            if (isStop) {} 
            else {
                isStop = true;
                timeElapsed += (Date.now() - startTime) / 1000;
            }
        }
        else if (message.timer == "reset") {
            startTime = Date.now();
            timeElapsed = 0;
            chrome.storage.sync.set({time:0});
        }  
    })
    port.onDisconnect.addListener(
        function() {
            clearInterval(counting);
        }
    )
})


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.warning == "tab closing") {
    }
    }
);


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.warning == "tab closing") {
            isStop = true;
            sendResponse({ farewell: "goodbye" });
            chrome.storage.sync.get("time", (items) => {
                chrome.storage.sync.set({time: items.time + timeElapsed}, () => {timeElapsed = 0;});
            });
            chrome.storage.sync.get(["time"], function(items) {
                console.log('Value currently is ' + items.time);
            });
        }
    }
);

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({whitelistOfPlaylists: [], blacklistOfPlaylists: [], time : 0});
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
                chrome.runtime.sendMessage({ warning: "blacklist" }, function (response) {
                });
                return;
            } 
        }
        chrome.runtime.sendMessage({ warning: "whitelist" }, function (response) {
        });
    });
})