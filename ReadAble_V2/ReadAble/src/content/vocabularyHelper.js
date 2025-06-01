class VocabularyHelper {
    constructor() {
        this.apiKey = '49271852f8msh0708f6bec15a253p1d8d3fjsnc4272774025e';
        this.initializeTooltip();
        this.addWordListeners();
        console.log('VocabularyHelper initialized'); // Debug log
    }

    initializeTooltip() {
        const existingTooltip = document.getElementById('vocab-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.id = 'vocab-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            display: none;
            background: white;
            color: black;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            max-width: 300px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            pointer-events: auto;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(tooltip);
        console.log('Tooltip initialized'); // Debug log
    }

    addWordListeners() {
        // Single click and drag selection
        document.addEventListener('mouseup', async (e) => {
            const selection = window.getSelection();
            const word = selection.toString().trim();
            
            if (word && word.length > 0 && !/\s/.test(word)) {
                console.log('Word selected:', word); // Debug log
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                await this.showDefinition(word, rect.left, rect.bottom);
            }
        });

        // Close tooltip when clicking outside
        document.addEventListener('mousedown', (e) => {
            const tooltip = document.getElementById('vocab-tooltip');
            if (tooltip && !tooltip.contains(e.target)) {
                this.hideTooltip();
            }
        });
    }

    async showDefinition(word, x, y) {
        const tooltip = document.getElementById('vocab-tooltip');
        console.log('Fetching definition for:', word);
        
        try {
            // Show loading state
            tooltip.innerHTML = `Loading definition for "${word}"...`;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y + 10}px`;
            tooltip.style.display = 'block';

            // Test API key directly
            const API_KEY = '49271852f8msh0708f6bec15a253p1d8d3fjsnc4272774025e';
            const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${encodeURIComponent(word.toLowerCase())}`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': API_KEY,
                    'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
                }
            });

            // Log full response for debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers));

            const data = await response.json();
            console.log('API Response data:', data);

            // More detailed error checking
            if (!response.ok) {
                throw new Error(`API error: ${response.status} - ${data.message || 'Unknown error'}`);
            }

            if (!data || !data.results) {
                throw new Error('Invalid API response structure');
            }

            const definitions = data.results.filter(result => result.definition);
            if (definitions.length === 0) {
                throw new Error('No definitions found in response');
            }

            // Use the first available definition
            const definition = definitions[0].definition;
            const synonyms = definitions[0].synonyms || [];

            // Update tooltip with definition
            tooltip.innerHTML = `
                <div style="max-width: 300px; background: white;">
                    <strong style="font-size: 16px; color: #2c3e50; display: block; margin-bottom: 8px;">
                        ${word}
                    </strong>
                    <div style="color: #333; margin-bottom: 8px;">
                        ${definition}
                    </div>
                    ${synonyms.length > 0 ? `
                        <div style="color: #666; font-size: 12px;">
                            <strong>Synonyms:</strong> ${synonyms.slice(0, 3).join(', ')}
                        </div>
                    ` : ''}
                </div>
            `;

            // Position tooltip
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let left = Math.min(x, viewportWidth - tooltipRect.width - 10);
            let top = y + 10;

            if (top + tooltipRect.height > viewportHeight) {
                top = y - tooltipRect.height - 10;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.display = 'block';

        } catch (error) {
            console.error('Definition lookup failed:', error);
            console.error('Full error details:', {
                message: error.message,
                stack: error.stack,
                word: word
            });

            tooltip.innerHTML = `
                <div style="color: #d63031; padding: 10px; background: white;">
                    <strong>Could not find definition</strong><br>
                    <small>Please try another word</small>
                </div>
            `;
            setTimeout(() => this.hideTooltip(), 3000);
        }
    }

    hideTooltip() {
        const tooltip = document.getElementById('vocab-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
}

// Initialize the VocabularyHelper
const vocabularyHelper = new VocabularyHelper();
console.log('VocabularyHelper ready'); // Debug log