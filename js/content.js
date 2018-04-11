// receives message from background script


chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("I'm here!!");
    console.log(message);
    
    if(message.method === "getFolder") {
        /*
        $('a[folder]').each(function( index ) {
            console.log( index + ": " + $( this ).attr("folder") );
        });*/

        var folder = $('a[folder]').attr("folder");
        
        sendResponse({folderUrl: folder});
        return true;
    }
    
    if (message.logUrl) {
        var url = document.URL;
        //alert(url);
        console.log(url);
    }
});



$(function() {
    // TODO Line below does not work in englisch version of lea!
    if($("html, body").text().includes("LEA-Anmeldeseite")) {
        $("html, body").animate({ scrollTop: $(document).height() }, 500);
    
        console.log("Login in progress!!");
        chrome.storage.local.get('login_data', function(result) {
            var login_data = result.login_data;
            if(login_data.username === undefined) {
                console.log("No user data entered yet!");
            } else {
                $("#username").val(login_data.username);
                $("#password").val(login_data.password);

                $("input[name='cmd[showLogin]'").click();
            }
        });
    } else {

        

        chrome.storage.local.get('lea_links', (result) => {
            links = ""
            var lea_links = result.lea_links;
            if(lea_links !== undefined) {
                lea_links.forEach((el) => {
                    links += `<li><a href="${el.link}">${el.name}</a></li>`;
                });
            }

            html = `
            <div id="lea_extension_menu">
                <ul>
                    ${links}
                </ul>
            </div>`;
    
            $("#ilTopBar .row").append(html);
            $(".ilTopTitle").text("LEA");
        });
    }
});