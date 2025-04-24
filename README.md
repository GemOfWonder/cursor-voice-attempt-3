# Cursor Voice Commands

A VS Code extension that allows you to interact with Cursor AI using voice commands. This extension uses the Web Speech API to convert your voice into text commands.

## Features

- Voice-to-text conversion using Web Speech API
- Configurable language support
- Real-time status feedback
- Seamless integration with Cursor AI

## Installation

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "Cursor Voice Commands"
4. Click Install
5. Reload VS Code when prompted

Alternatively, you can install the extension manually:
1. Download the .vsix file from the releases page
2. Open VS Code
3. Go to the Extensions view
4. Click the "..." menu in the top right
5. Select "Install from VSIX..."
6. Choose the downloaded .vsix file

## Usage

### Starting Voice Commands

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the command palette
2. Type "Start Voice Commands" and press Enter
3. A webview will open showing the current status
4. Allow microphone access when prompted
5. Start speaking your commands

### Stopping Voice Commands

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Stop Voice Commands" and press Enter

### Configuration

You can configure the extension by:

1. Opening VS Code settings (Ctrl+, or Cmd+,)
2. Search for "Cursor Voice"
3. Available settings:
   - `cursorVoice.language`: Set the language for speech recognition (default: "en-US")

## Supported Languages

The extension supports all languages available in the Web Speech API. Some common language codes:
- English (US): `en-US`
- English (UK): `en-GB`
- Spanish: `es-ES`
- French: `fr-FR`
- German: `de-DE`
- Dutch: `nl-NL`

## Requirements

- VS Code 1.99.0 or higher
- A working microphone
- Internet connection (for Web Speech API)
- Modern web browser (Chrome, Edge, or Firefox recommended)

## Known Issues

- Speech recognition may not work in all browsers
- Some languages may have limited support
- Microphone access must be granted for the extension to work

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions, please:
1. Check the [issues page](https://github.com/Gem_of_Wonder/cursor-voice-attempt-3/issues)
2. Create a new issue if your problem isn't listed
3. Include:
   - VS Code version
   - Extension version
   - Steps to reproduce
   - Expected behavior
   - Actual behavior

## Release Notes

### 0.0.1
- Initial release
- Basic voice recognition functionality
- Configurable language support
- Status feedback in webview

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
