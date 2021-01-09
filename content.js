// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// alert("Welcome to Whitelist.io")
// alert("This extension logs your youtube time")

// content.js
chrome.tabs.onRemoved.addListener(
  function(tabId,removeInfo) {
    chrome.runtime.sendMessage({ warning: "tab closing" }, function (response) {
      console.log(response.farewell);
    });
  }
)

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let url = (new URL(tabs[0].url)).hostname;
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