// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
alert("Welcome to Whitelist.io")
alert("This extension logs your youtube time")

// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "clicked_browser_action") {
      console.log("The URL is " + window.location.href)
    }
  }
)
                                     
