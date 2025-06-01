class TextSimplifier {
    constructor() {
        this.apiKey = 'sk-753ecae759d8455ebd44420ed9707d64';
        this.addSimplifyButton();
        this.observeDocumentChanges();
    }

    observeDocumentChanges() {
        const observer = new MutationObserver((mutations) => {
            if (!document.getElementById('readable-simplify')) {
                this.addSimplifyButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addSimplifyButton() {
        const existingButton = document.getElementById('readable-simplify');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.id = 'readable-simplify';
        button.textContent = 'Simplify Text';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 20px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        
        button.addEventListener('click', () => this.simplifyContent());
        document.body.appendChild(button);
    }

    extractMainContent() {
        const article = document.querySelector('article') || 
                       document.querySelector('main') || 
                       document.querySelector('.content');
        
        if (article) {
            return article.innerText;
        }

        // Fallback to finding the largest text container
        let maxLength = 0;
        let mainContent = '';
        const containers = document.querySelectorAll('p, article, section, div');
        
        containers.forEach(container => {
            if (container.innerText.length > maxLength) {
                maxLength = container.innerText.length;
                mainContent = container.innerText;
            }
        });

        return mainContent;
    }

    async simplifyContent() {
        const mainContent = this.extractMainContent();
        if (!mainContent) {
            alert('No main content found to simplify.');
            return;
        }

        const loadingIndicator = this.showLoadingState();

        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [{
                        role: "user",
                        content: `Simplify this text for dyslexia by:
                        1. Breaking down complex sentences
                        2. Using simpler words
                        3. Adding bold formatting to key terms
                        4. Maintaining the original meaning
                        Text: ${mainContent}`
                    }],
                    temperature: 0.3,
                    max_tokens: 4000,
                    stop: null
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.error) {
                throw new Error(`API Error: ${data.error.message}`);
            }

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error('Unexpected API response:', data);
                throw new Error('Invalid API response structure');
            }

            const simplifiedHtml = data.choices[0].message.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>')
                .trim();

            if (!simplifiedHtml) {
                throw new Error('Empty response from API');
            }

            this.replaceContent(simplifiedHtml);
        } catch (error) {
            console.error('Simplification failed:', error);
            alert(`Failed to simplify text: ${error.message}`);
        } finally {
            loadingIndicator.remove();
        }
    }

    showLoadingState() {
        const loader = document.createElement('div');
        loader.id = 'readable-loader';
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
        `;
        loader.textContent = 'Simplifying text...';
        document.body.appendChild(loader);
        return loader;
    }

    replaceContent(simplifiedHtml) {
        const mainContent = document.querySelector('article') || 
                          document.querySelector('main') || 
                          document.querySelector('.content');
        
        if (mainContent) {
            mainContent.innerHTML = simplifiedHtml;
        } else {
            const container = document.createElement('div');
            container.innerHTML = simplifiedHtml;
            document.body.innerHTML = container.innerHTML;
        }
    }
}

// Initialize the TextSimplifier
new TextSimplifier();