# Chrome Extension for LEA (H-BRS University)

This extensions keeps your lea sessions active. No more signing in! If you enter your credentials, it can automatically log you back in if you get kicked out of a lea session. And you can browser the content of a course in a simple html file browser. It also reduces the size of the footer. And last but not least it supports a "bookmark"-style navigation bar to navigate to your most frequent courses.

## Getting Started

### Installation

- Please either clone this repository or download as a ZIP file.
- Extract the contents into your preferred working directory.
- Open your Google Chrome browser.
- Enter `chrome://extensions/` into the address bar.
- Ensure "Developer Mode" is ticked/enabled in the top right.
- Click on "Load unpacked extension...".
- Navigate to your extracted directory, and click "OK".
- Your basic extension template should now be alongside your address bar, showing the Google Chrome logo.

## Usage

This package is standalone.  Please visit the Google Developer documentation if you wish to know more about Extension creating:

http://developer.chrome.com/extensions/getstarted.html

### Files to edit

The main files you will need to edit are:

> manifest.json

- This contains all of your extension information.
- As an example, the storage permission has been added.
- The default popup window for this extension is called `popup.html`.

> popup.html

- Contains the basic HTML boilerplate, edit at your will.
- A standard (non-responsive) navbar is enabled.
- The main content area is wrapped inside `section`.

> css/custom.css

- Contains extension height and width.
- Once the extension breaks the height overflow, a styled CSS scroll bar is added.
- Style tweaks are also present to deal with scroll bar presence.

> js/content.js

- used to perform auto-login 
- used to add shortcut-links on top of website