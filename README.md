# ReadAble Browser Extension

## Mission
ReadAble is a browser extension designed to improve digital accessibility for users with dyslexia, ADHD, and visual impairments. The extension provides various features to enhance the reading experience on the web.

## Core Features
1. **Text Customization Module**
   - Dynamically injects CSS to modify fonts, letter/line spacing, and background/text colors.
   - Includes presets such as "Dyslexia Mode" and "Night Reader".
   - User preferences are saved using `chrome.storage.sync`.

2. **AI Text Simplification**
   - Adds a "Simplify" button to the DOM.
   - Extracts main page content and sends it to the DeepSeek API for simplification.
   - Replaces original content with processed HTML while maintaining meaning.

3. **Text-to-Speech (TTS) Functionality**
   - Integrates the Web Speech API for text-to-speech capabilities.
   - Provides controls for play/pause and speed selection.
   - Highlights words as they are spoken.

4. **Vocabulary Helper Tooltip**
   - Displays tooltips with definitions, simple synonyms, and emoji visualizations on word hover.
   - Fetches definitions from WordsAPI.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd ReadAble
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Load the extension in your browser:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `ReadAble` directory.

## Usage
- Click the ReadAble icon in the browser toolbar to open the popup interface.
- Use the options page to manage presets and customize your reading experience.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.