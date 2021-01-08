let addToWhitelist = document.getElementById('addToWhitelist');
let clearButton = document.getElementById('clearButton');

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