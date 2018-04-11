(function() {
    // receives message from popup script
    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
        console.log(request);
        if (request.opened == true) {
            // sends response back to popup script
            sendResponse({example: "goodbye"});

            // sends response to content script
            //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.query({ active: true }, function(tabs) {
                console.log("Sending text to tab: " + tabs[0].id + " - " + tabs[0].title);
                chrome.tabs.sendMessage(tabs[0].id, { logUrl: true } );
            });
        }
    });
    
    const timerKeepSessionAliveLabel = "KEEP_SESSION_ALIVE";
    
    chrome.alarms.create(timerKeepSessionAliveLabel, {
        delayInMinutes: 10,
        periodInMinutes: 10
    });

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === timerKeepSessionAliveLabel) {
            $.get("https://lea.hochschule-bonn-rhein-sieg.de/", function( data ) {
                //console.log(data);
                
                if(data.includes("LEA-Anmeldeseite")) {
                    //I'm not logged in!!!
                    console.log("Not logged in!");
                    
                    chrome.storage.local.get('login_data', function(result) {
                        var login_data = result.login_data;
                        console.log(login_data);
                        if(login_data.username === undefined) {
                            //No user data entered yet!
                            console.log("No login data entered yet!");
                        } else {
                            $.post("https://lea.hochschule-bonn-rhein-sieg.de/ilias.php?lang=de&cmd=post&cmdClass=ilstartupgui&cmdNode=qf&baseClass=ilStartUpGUI&rtoken=",
                                {
                                    'username': login_data.username,
                                    'password': login_data.password
                                },
                                function( data ) {
                                    console.log("Login performed");
                                    //console.log("Login result:");
                                    //console.log(data);
                                });
                        }
                    });
                    
                } else {
                    console.log("I'm logged in!");
                    //I'm logged in.. everything is fine!
                }
            });
        }
    });
    
})();