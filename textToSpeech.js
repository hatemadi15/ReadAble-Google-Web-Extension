class TextToSpeech {
    constructor() {
        this.utterance = null;
        this.isPlaying = false;
        this.currentNode = null;
        this.initializeControls();
    }

    initializeControls() {
        const controls = document.createElement('div');
        controls.innerHTML = `
            <div id="tts-controls" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 10000;
            ">
                <button id="tts-play">Play</button>
                <select id="tts-rate">
                    <option value="0.5">0.5x</option>
                    <option value="0.8" selected>0.8x</option>
                    <option value="1.0">1.0x</option>
                </select>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        document.getElementById('tts-play').addEventListener('click', () => this.toggleSpeech());
        document.getElementById('tts-rate').addEventListener('change', (e) => this.setRate(e.target.value));
    }

    toggleSpeech() {
        if (this.isPlaying) {
            speechSynthesis.cancel();
            this.isPlaying = false;
            document.getElementById('tts-play').textContent = 'Play';
            this.removeHighlight();
        } else {
            this.startReading();
        }
    }

    startReading() {
        const text = document.body.innerText;
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.rate = parseFloat(document.getElementById('tts-rate').value);
        
        this.utterance.onboundary = (event) => {
            if (event.name === 'word') {
                this.highlightWord(event);
            }
        };

        this.utterance.onend = () => {
            this.isPlaying = false;
            document.getElementById('tts-play').textContent = 'Play';
            this.removeHighlight();
        };

        speechSynthesis.speak(this.utterance);
        this.isPlaying = true;
        document.getElementById('tts-play').textContent = 'Pause';
    }

    setRate(rate) {
        if (this.utterance) {
            this.utterance.rate = parseFloat(rate);
        }
    }

    highlightWord(event) {
        this.removeHighlight();
        
        const words = document.body.innerText.split(' ');
        let charCount = 0;
        let wordIndex = 0;

        for (let i = 0; i < words.length; i++) {
            if (charCount + words[i].length >= event.charIndex) {
                wordIndex = i;
                break;
            }
            charCount += words[i].length + 1;
        }

        const range = document.createRange();
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let currentNode = walker.nextNode();
        while (currentNode) {
            if (currentNode.textContent.includes(words[wordIndex])) {
                const start = currentNode.textContent.indexOf(words[wordIndex]);
                range.setStart(currentNode, start);
                range.setEnd(currentNode, start + words[wordIndex].length);
                
                const highlight = document.createElement('span');
                highlight.style.backgroundColor = 'yellow';
                highlight.className = 'tts-highlight';
                
                range.surroundContents(highlight);
                break;
            }
            currentNode = walker.nextNode();
        }
    }

    removeHighlight() {
        const highlights = document.querySelectorAll('.tts-highlight');
        highlights.forEach(h => {
            const parent = h.parentNode;
            parent.replaceChild(document.createTextNode(h.textContent), h);
            parent.normalize();
        });
    }
}

new TextToSpeech();