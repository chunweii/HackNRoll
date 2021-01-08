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
                                     
