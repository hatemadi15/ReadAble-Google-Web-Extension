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

    function updateUI(settings) {
        const fontSelect = document.getElementById('fontFamily');
        const letterSpacingInput = document.getElementById('letterSpacing');
        const lineHeightInput = document.getElementById('lineHeight');

        fontSelect.value = settings.fontFamily;
        letterSpacingInput.value = settings.letterSpacing;
        lineHeightInput.value = settings.lineHeight;
    }

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