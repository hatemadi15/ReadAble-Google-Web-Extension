class AccessibilityScorecard {
    constructor() {
        this.setupMessageListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'showScorecard') {
                this.runAccessibilityCheck();
            }
        });
    }

    async runAccessibilityCheck() {
        try {
            const results = await axe.run();
            this.showScorecard(results);
        } catch (error) {
            console.error('Accessibility check failed:', error);
            this.showError();
        }
    }

    showScorecard(results) {
        // Remove existing scorecard if any
        const existingScorecard = document.getElementById('readable-scorecard');
        if (existingScorecard) {
            existingScorecard.remove();
        }

        const score = Math.round((results.passes.length / (results.passes.length + results.violations.length)) * 100);
        
        const scorecard = document.createElement('div');
        scorecard.id = 'readable-scorecard';
        scorecard.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 999999;
            font-family: Arial, sans-serif;
            max-width: 300px;
        `;

        scorecard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="margin: 0; color: #2c3e50;">Accessibility Score</h2>
                <button id="close-scorecard" style="border: none; background: none; cursor: pointer; font-size: 20px;">&times;</button>
            </div>
            <div style="text-align: center; font-size: 36px; color: ${score >= 70 ? '#27ae60' : '#e74c3c'}; margin: 15px 0;">
                ${score}%
            </div>
            <div style="margin-top: 15px;">
                <p style="margin: 5px 0; color: #27ae60;">✓ ${results.passes.length} tests passed</p>
                <p style="margin: 5px 0; color: #e74c3c;">✗ ${results.violations.length} violations found</p>
            </div>
        `;

        document.body.appendChild(scorecard);

        // Add close button functionality
        document.getElementById('close-scorecard').addEventListener('click', () => {
            scorecard.remove();
        });
    }

    showError() {
        const error = document.createElement('div');
        error.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 999999;
        `;
        error.textContent = 'Failed to generate accessibility scorecard';
        document.body.appendChild(error);
        setTimeout(() => error.remove(), 3000);
    }
}

// Initialize the scorecard
new AccessibilityScorecard();