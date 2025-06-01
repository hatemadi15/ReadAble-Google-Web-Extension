function initPopup() {
    const simplifyButton = document.getElementById('simplify-button');
    const textCustomizationButton = document.getElementById('text-customization-button');
    const ttsButton = document.getElementById('tts-button');
    const vocabularyHelperButton = document.getElementById('vocabulary-helper-button');

    simplifyButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content/aiSimplification.js']
            });
        });
    });

    textCustomizationButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content/textCustomization.js']
            });
        });
    });

    ttsButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content/textToSpeech.js']
            });
        });
    });

    vocabularyHelperButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content/vocabularyHelper.js']
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let currentSettings = {
        fontFamily: 'Arial',
        letterSpacing: 0,
        lineHeight: 1.5,
        theme: 'default'
    };

    // Load saved preferences
    chrome.storage.sync.get(currentSettings, (items) => {
        currentSettings = items;
        updateUI(currentSettings);
    });

    // Font family change
    document.getElementById('fontFamily').addEventListener('change', (e) => {
        currentSettings.fontFamily = e.target.value;
        saveAndApplySettings();
    });

    // Letter spacing change
    document.getElementById('letterSpacing').addEventListener('input', (e) => {
        currentSettings.letterSpacing = parseFloat(e.target.value);
        saveAndApplySettings();
    });

    // Line height change
    document.getElementById('lineHeight').addEventListener('input', (e) => {
        currentSettings.lineHeight = parseFloat(e.target.value);
        saveAndApplySettings();
    });

    // Night Reader theme
    document.getElementById('nightReader').addEventListener('click', () => {
        // Toggle between night and default theme
        currentSettings = {
            ...currentSettings,
            theme: currentSettings.theme === 'night' ? 'default' : 'night'
        };
        chrome.storage.sync.set(currentSettings);
        updateUI(currentSettings);
        updatePage(currentSettings);
    });

    // Add scorecard button listener
    document.getElementById('showScorecard').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'showScorecard'
            });
        });
        window.close(); // Close popup after clicking
    });

    function updateUI(settings) {
        const fontSelect = document.getElementById('fontFamily');
        const letterSpacingInput = document.getElementById('letterSpacing');
        const lineHeightInput = document.getElementById('lineHeight');
        const nightButton = document.getElementById('nightReader');

        fontSelect.value = settings.fontFamily;
        letterSpacingInput.value = settings.letterSpacing;
        lineHeightInput.value = settings.lineHeight;
        nightButton.textContent = settings.theme === 'night' ? 'Light Mode' : 'Night Reader';
    }

    function saveAndApplySettings() {
        chrome.storage.sync.set(currentSettings, () => {
            updatePage(currentSettings);
        });
    }

    function updatePage(settings) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'updateStyles',
                    settings: settings
                });
            }
        });
    }
});