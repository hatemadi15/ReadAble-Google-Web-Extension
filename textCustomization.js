// This file implements the text customization module, dynamically injecting CSS to modify fonts, letter/line spacing, and background/text colors.

class TextCustomizer {
    constructor() {
        this.initializeFonts();
        this.loadUserPreferences();
        this.setupMessageListener();
    }

    async initializeFonts() {
        try {
            const fontFace = new FontFace('OpenDyslexic', 
                `url(${chrome.runtime.getURL('fonts/OpenDyslexic/OpenDyslexic-Regular.otf')})`
            );
            await fontFace.load();
            document.fonts.add(fontFace);
        } catch (error) {
            console.error('Failed to load OpenDyslexic font:', error);
        }
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.type === 'updateStyles') {
                this.applyStyles(request.settings);
            }
            return true;
        });
    }

    async loadUserPreferences() {
        const preferences = await chrome.storage.sync.get({
            fontFamily: 'Arial',
            letterSpacing: 0,
            lineHeight: 1.5,
            theme: 'default'
        });
        this.applyStyles(preferences);
    }

    applyStyles(settings) {
        const existingStyle = document.getElementById('readable-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'readable-styles';
        style.textContent = `
            body, p, div, span, h1, h2, h3, h4, h5, h6 {
                font-family: "${settings.fontFamily}" !important;
                letter-spacing: ${settings.letterSpacing}px !important;
                line-height: ${settings.lineHeight} !important;
            }
        `;

        if (settings.theme === 'night') {
            style.textContent += `
                body {
                    background-color: #1a1a1a !important;
                    color: #ffffff !important;
                }
                a {
                    color: #66b3ff !important;
                }
            `;
        }

        document.head.appendChild(style);
    }
}

new TextCustomizer();