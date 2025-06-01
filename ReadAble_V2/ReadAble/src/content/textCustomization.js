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
        
        // Base styles for text customization
        let styleText = `
            body, p, div, span, h1, h2, h3, h4, h5, h6 {
                font-family: "${settings.fontFamily}" !important;
                letter-spacing: ${settings.letterSpacing}px !important;
                line-height: ${settings.lineHeight} !important;
            }
        `;

        // Add dark mode styles if theme is 'night', otherwise restore default colors
        if (settings.theme === 'night') {
            styleText += `
                :root {
                    background-color: #1a1a1a !important;
                }
                body {
                    background-color: #1a1a1a !important;
                    color: #ffffff !important;
                }
                p, div, span, h1, h2, h3, h4, h5, h6 {
                    color: #ffffff !important;
                }
                a {
                    color: #66b3ff !important;
                }
                img, video, canvas {
                    filter: brightness(0.8) !important;
                }
                /* Preserve white background for tooltips and popups */
                #vocab-tooltip, .readable-popup {
                    background-color: white !important;
                    color: black !important;
                }
            `;
        } else {
            // Reset to light mode
            styleText += `
                :root {
                    background-color: #ffffff !important;
                }
                body {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                }
                p, div, span, h1, h2, h3, h4, h5, h6 {
                    color: #000000 !important;
                }
                a {
                    color: #0066cc !important;
                }
                img, video, canvas {
                    filter: none !important;
                }
            `;
        }

        style.textContent = styleText;
        document.head.appendChild(style);

        // Store current theme in data attribute
        document.documentElement.setAttribute('data-readable-theme', settings.theme);

        // Force redraw to ensure styles are applied
        document.body.style.webkitTransform = 'scale(1)';
        document.body.style.webkitTransform = null;
    }
}

new TextCustomizer();