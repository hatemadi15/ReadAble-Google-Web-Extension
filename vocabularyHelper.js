// This file implements the vocabulary helper tooltip functionality.

class VocabularyHelper {
    constructor() {
        this.apiKey = '49271852f8msh0708f6bec15a253p1d8d3fjsnc4272774025e';
        this.initializeTooltip();
        this.addWordListeners();
    }

    initializeTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'vocab-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            display: none;
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            max-width: 200px;
            z-index: 10000;
        `;
        document.body.appendChild(tooltip);
    }

    addWordListeners() {
        document.body.addEventListener('mouseover', async (e) => {
            if (e.target.matches('p, h1, h2, h3, h4, h5, h6, span, div')) {
                const selection = window.getSelection();
                const range = document.createRange();
                
                if (e.target.firstChild) {
                    range.setStart(e.target.firstChild, 0);
                    range.setEnd(e.target.firstChild, e.target.firstChild.length);
                    
                    const word = range.toString().trim();
                    if (word) {
                        await this.showDefinition(word, e.clientX, e.clientY);
                    }
                }
            }
        });
    }

    async showDefinition(word, x, y) {
        try {
            const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${encodeURIComponent(word)}`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch definition');
            }

            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const definition = data.results[0].definition;
                const synonyms = data.results[0].synonyms || [];
                
                const tooltip = document.getElementById('vocab-tooltip');
                tooltip.innerHTML = `
                    <strong>${word}</strong><br>
                    ${definition}<br>
                    ${synonyms.length > 0 ? `<small>Synonyms: ${synonyms.slice(0, 3).join(', ')}</small>` : ''}
                `;
                
                tooltip.style.left = `${x + 10}px`;
                tooltip.style.top = `${y + 10}px`;
                tooltip.style.display = 'block';

                setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to fetch definition:', error);
        }
    }
}

new VocabularyHelper();