function loadLogin() {
    console.log("Load login!");
    $("#content").load("login.html", () => {
        fillLoginData();
    });
}

function fillLoginData() {
    chrome.storage.local.get('login_data', (result) => {
        var login_data = result.login_data;
        if(login_data !== undefined) {
            $("#username").val(login_data.username);
            $("#password").val(login_data.password);
        }
    });
}

function loadFolderIntoContentView(folderUrl) {
    console.log("Opening folder: " + folderUrl);
    $("#content").load(folderUrl, function() {
        console.log("Load finished!");

        $("p:contains('You got here, because your browser')").remove();
        $("p:contains('Open this page as a Webfolder with')").remove();

        $("p:contains('Sie sind hierher gelang')").remove();
        $("p:contains('Diese Seite als Webordner ')").remove();
    });
}

var folderUrl = undefined;
const regexFile = /\..{1,4}$/;
function loadFolderView() {
    $("#content").text("Please open a LEA Course to list folders or reload the page");
    chrome.tabs.query({ active: true }, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { method: "getFolder" },
            function(response) {
                console.log("getFolder returned!");
                
                if(response !== undefined && response.folderUrl !== undefined) { //undefined if user is not logged in!
                    console.log("User is logged in?!!");
                    console.log(response.folderUrl);
                    folderUrl = response.folderUrl;

                    $("#content").text("");
                    loadFolderIntoContentView(folderUrl);
                }
            });
    });
}

function handleFolderLinkClick(href) {
    var isFile = (regexFile.exec(href) !== null);
    if(isFile) {
        console.log("File detected --> Download!");
        chrome.downloads.download({
            url: (folderUrl + href),
            filename: decodeURI(href),
            saveAs: true
        });
        return true;
    }
    
    if (href.match("^https://lea.")) {
       // Nothing to do here! Absolut url already given..
        folderUrl = href;
    } else {
        console.log("Folder detected!");
        //Navigate between folders..
        folderUrl += href;
        href = folderUrl;
    }
    
    loadFolderIntoContentView(href);
}

function loadLinks() {
    chrome.storage.local.get('lea_links', (result) => {
        var lea_links = result.lea_links;
        if(lea_links !== undefined) {
            lea_links.forEach((el) => {
                addRowToLinkView(el.name, el.link);
            });
        }
    });
}

function addRowToLinkView(name, link) {
    row = `
    <tr>
        <td><input name="name" value="${name}"></td>
        <td><input name="link" value="${link}"></td>
        <td>
            <button class="link_manager_delete_row" type="button" class="btn btn-default btn-number">
                <span class="glyphicon glyphicon-minus"></span>
            </button>
        </td>
    </tr>`;

    $("#link_manager_table_body").append(row);
}

$(function() {
    // sends message to background script
    /*
    chrome.runtime.sendMessage({opened: true}, function(response) {
        console.log(response.example);
    });
    */
    loadLogin();
    
    $('#content').on('submit', '#login_data', function(event) {
        event.preventDefault();
        
        var username = $("#username").val();
        var password = $("#password").val();
        
        chrome.storage.local.set({"login_data": { 'username' : username, 'password': password }}, function() {
            console.log("Stored!!");
        });
    });
    
    // Handle clicks on links in the folders view
    $('#content').on('click', 'a', function(event) {
        event.preventDefault();
        var href = $(this).attr("href");
        handleFolderLinkClick(href);
    });
    
    
    
    $("#btn_load_login").click(() => {
        loadLogin();
    });

    $("#btn_hbrs_banner").click(() => {
        loadLogin();
    });
    
    $("#btn_load_folder").click(() => {
        loadFolderView();
    });

    $("#logout").click(() => {
        chrome.storage.local.remove("login_data");
    });
    
    $("#link_folder").click(() => {
        loadFolderIntoContentView(folderUrl);
    });

    $("#btn_link_manager").click(() => {
        $("#content").load("link_manager.html", () => {
            loadLinks();
        });
    });

    $('#content').on('click', '#link_manager_add_row', (event) => {
        addRowToLinkView("", "");
    });

    $('#content').on('click', '#link_manager_save', (event) => {
        links = [];
        $('#link_manager_table_body > tr').each(function() {
            let name = $(this).find('[name="name"]').val();
            let link = $(this).find('[name="link"]').val();
            links.push({ 'name': name, 'link': link });
        });

        chrome.storage.local.set({ "lea_links": links });

        //$("#content").text(links);
        $("#content").text("Saved!");
    });

    $('#content').on('click', '.link_manager_delete_row', function(event) {
        console.log("Delete!");
        $(this).parents('tr').remove();
    });
    
});