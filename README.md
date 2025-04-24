# Cursor Voice Commands Extension

A VS Code/Cursor extension that enables voice commands and voice-to-text functionality using the Web Speech API.

## Features

- Voice commands for controlling the extension
- Voice-to-text input for Cursor AI
- Visual feedback for command recognition
- Offline support (using Web Speech API)

## Installation

1. Download the extension from the VS Code marketplace
2. Install the extension in VS Code/Cursor
3. Grant microphone permissions when prompted

## Microphone Access

To use the extension, you need to grant microphone access:

### First-time Setup
- When you first use the extension, your browser will prompt you to allow microphone access
- Click "Allow" when prompted

### Manual Permission Setup
If you need to grant or revoke access later:

1. **In VS Code/Cursor:**
   - Click the lock icon in the address bar
   - Look for "Microphone" permissions
   - Select "Allow" from the dropdown menu

2. **In Chrome/Edge:**
   - Click the lock icon in the address bar
   - Click "Site settings"
   - Find "Microphone" in the permissions list
   - Change it to "Allow"

3. **In Firefox:**
   - Click the lock icon in the address bar
   - Click "Permissions"
   - Find "Use the Microphone"
   - Select "Allow"

### Troubleshooting Microphone Access
If you're having trouble with microphone access:
1. Make sure your microphone is properly connected and working
2. Check your system's microphone settings
3. Try revoking and re-granting microphone access
4. Restart VS Code/Cursor after changing permissions

## Usage

### Voice Commands

The extension recognizes the following voice commands:

1. **Start/Stop Listening**
   - "Start listening" or "Start voice commands" - Activates voice recognition
   - "Stop listening" or "Stop voice commands" - Deactivates voice recognition

2. **Cursor AI Interaction**
   - "Hey Cursor [your message]" - Focuses the Cursor AI chat and inputs your message
   - "Yo Cursor [your message]" - Same as above
   - "Hi Cursor [your message]" - Same as above
   - "Hello Cursor [your message]" - Same as above
   - "Send to cursor" or "Send message" or "Send it" - Sends the current message to Cursor AI

### Workflow

1. Say "Start listening" to activate voice recognition
2. To send a message to Cursor AI:
   - Say "Hey Cursor" followed by your message (e.g., "Hey Cursor how do I implement a binary search?")
   - The message will be typed into the chat input
   - Say "Send to cursor" to actually send the message
3. Say "Stop listening" when you're done

### Visual Feedback

The extension provides visual feedback through:
- A status indicator showing whether voice recognition is active
- A pulsing microphone icon when listening
- Highlighted text when commands are recognized
- Real-time transcript display
- Notifications for important events

## Configuration

You can configure the following settings in VS Code/Cursor settings:

- `cursorVoice.language`: Set the language for voice recognition (default: "en-US")
- `cursorVoice.autoStart`: Automatically start voice recognition when the extension activates (default: false)

## Troubleshooting

If you encounter issues:
1. Make sure you've granted microphone permissions
2. Check that your microphone is properly connected and working
3. Verify that your browser supports the Web Speech API
4. Try restarting VS Code/Cursor

## Requirements

- VS Code or Cursor editor
- Microphone
- Web Speech API support in your browser

## Known Issues

- Voice recognition may not work in all browsers
- Some commands might not be recognized in noisy environments
- The extension requires an active internet connection for voice recognition

## Contributing

Feel free to submit issues and enhancement requests!

## License

This extension is licensed under the MIT License.

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
