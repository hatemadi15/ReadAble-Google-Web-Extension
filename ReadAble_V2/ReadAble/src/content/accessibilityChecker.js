class AccessibilityChecker {
    constructor() {
        this.loadAxeCore();
    }

    async loadAxeCore() {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('lib/axe.min.js');
        
        script.onload = () => {
            this.runAccessibilityTests();
        };

        document.head.appendChild(script);
    }

    async runAccessibilityTests() {
        if (typeof axe === 'undefined') {
            console.error('axe-core not loaded');
            return;
        }

        try {
            const results = await axe.run();
            console.log('Accessibility Results:', {
                violations: results.violations.length,
                passes: results.passes.length,
                score: this.calculateScore(results)
            });
        } catch (error) {
            console.error('Accessibility test failed:', error);
        }
    }

    calculateScore(results) {
        const totalTests = results.passes.length + results.violations.length;
        const passedTests = results.passes.length;
        return (passedTests / totalTests) * 100;
    }
}

new AccessibilityChecker();