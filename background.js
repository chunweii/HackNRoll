// runs when extension installed

window.youtubeTime = 0;
window.redditTime = 0;
window.blacklist = [
    /^https:\/\/www\.youtube\.com\/watch\?v=/,
    /^https:\/\/www\.reddit\.com/
];

window.whitelist=[];

chrome.runtime.onInstalled.addListener(function () {
    // chrome.storage.sync.set({ color: '#3aa757' }, function () {
    //     console.log("The color is green.");
    // });
    // clears past set declarative content (including previous sessions)
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
                chrome.tabs.executeScript(null, {file: './handleBlacklist.js'}, () => console.log("handling blacklist"));
            } 
        }
    });
})