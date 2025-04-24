import * as vscode from 'vscode';

interface VoiceCommand {
    pattern: RegExp;
    action: (transcript: string) => void;
    description: string;
}

export class VoiceRecognitionService {
    private recognition: vscode.WebviewPanel | null = null;
    private isListening: boolean = false;
    private context: vscode.ExtensionContext;
    private commands: VoiceCommand[] = [];
    private lastCommandTime: number = 0;
    private commandTimeout: number = 2000; // 2 seconds timeout between commands

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.initializeCommands();
    }

    private initializeCommands() {
        this.commands = [
            {
                pattern: /^(start listening|start voice commands)$/i,
                action: () => this.startListening(),
                description: "Start voice recognition"
            },
            {
                pattern: /^(stop listening|stop voice commands)$/i,
                action: () => this.stopListening(),
                description: "Stop voice recognition"
            },
            {
                pattern: /^(hey cursor|yo cursor|hi cursor|hello cursor|hey assistant|yo assistant|hi assistant|hello assistant)\s*(.*)$/i,
                action: (transcript: string) => this.handleCursorCommand(transcript),
                description: "Talk to Cursor AI"
            },
            {
                pattern: /^(send to cursor|send message|send it)$/i,
                action: () => this.handleSendToCursor(),
                description: "Send the current message to Cursor AI"
            }
        ];
    }

    public async initialize() {
        // Web Speech API is initialized when startListening is called
    }

    private createWebview() {
        const config = vscode.workspace.getConfiguration('cursorVoice');
        const language = config.get<string>('language') || 'en-US';

        const webview = vscode.window.createWebviewPanel(
            'voice-recognition',
            'Voice Recognition',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                enableCommandUris: true,
                localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'media')]
            }
        );

        // Set content security policy to allow microphone access
        webview.webview.html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' https:; style-src 'unsafe-inline' https:; img-src https:; media-src 'self' blob:; connect-src https:;">
                <style>
                    body {
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }
                    .status {
                        margin-bottom: 20px;
                        padding: 10px;
                        border-radius: 4px;
                    }
                    .listening {
                        background-color: #e6f3ff;
                        color: #0066cc;
                    }
                    .stopped {
                        background-color: #f5f5f5;
                        color: #666;
                    }
                    .error {
                        background-color: #ffebee;
                        color: #c62828;
                    }
                    .permission-request {
                        margin: 20px 0;
                        padding: 15px;
                        background-color: #fff3e0;
                        border-radius: 4px;
                    }
                    button {
                        padding: 8px 16px;
                        background-color: #0066cc;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #0052a3;
                    }
                    .commands {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: #f5f5f5;
                        border-radius: 4px;
                    }
                    .command {
                        margin: 5px 0;
                        padding: 5px;
                        background-color: white;
                        border-radius: 4px;
                    }
                    .recognition-feedback {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: #f5f5f5;
                        border-radius: 4px;
                        min-height: 100px;
                    }
                    .recognition-text {
                        margin: 5px 0;
                        padding: 5px;
                        background-color: white;
                        border-radius: 4px;
                    }
                    .command-detected {
                        background-color: #e8f5e9;
                        color: #2e7d32;
                        animation: highlight 1s ease-out;
                    }
                    @keyframes highlight {
                        0% { background-color: #e8f5e9; }
                        100% { background-color: white; }
                    }
                    .mic-status {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        margin-right: 8px;
                    }
                    .mic-on {
                        background-color: #4caf50;
                        animation: pulse 1s infinite;
                    }
                    .mic-off {
                        background-color: #f44336;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); }
                    }
                </style>
            </head>
            <body>
                <div id="status" class="status stopped">
                    <span id="micIcon" class="mic-status mic-off"></span>
                    Voice recognition stopped
                </div>
                <div id="permission" class="permission-request" style="display: none;">
                    <p>This extension needs access to your microphone to work. Please click the button below to grant permission.</p>
                    <button id="requestPermission">Grant Microphone Access</button>
                </div>
                <div class="commands">
                    <h3>Available Commands:</h3>
                    <div class="command">"Start listening" or "Start voice commands"</div>
                    <div class="command">"Stop listening" or "Stop voice commands"</div>
                    <div class="command">"Hey Cursor [your message]"</div>
                    <div class="command">"Yo Cursor [your message]"</div>
                    <div class="command">"Hi Cursor [your message]"</div>
                    <div class="command">"Hello Cursor [your message]"</div>
                </div>
                <div class="recognition-feedback">
                    <h3>Recognition Feedback:</h3>
                    <div id="transcript" class="recognition-text"></div>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    let recognition;
                    let isListening = false;
                    let lastCommandTime = 0;
                    const commandTimeout = 2000; // 2 seconds

                    function updateStatus(listening, error) {
                        const status = document.getElementById('status');
                        const micIcon = document.getElementById('micIcon');
                        status.className = 'status ' + (error ? 'error' : (listening ? 'listening' : 'stopped'));
                        status.textContent = error || (listening ? 'Listening...' : 'Voice recognition stopped');
                        micIcon.className = 'mic-status ' + (listening ? 'mic-on' : 'mic-off');
                    }

                    function showPermissionRequest() {
                        document.getElementById('permission').style.display = 'block';
                    }

                    function hidePermissionRequest() {
                        document.getElementById('permission').style.display = 'none';
                    }

                    function updateTranscript(text, isCommand = false) {
                        const transcript = document.getElementById('transcript');
                        transcript.textContent = text;
                        if (isCommand) {
                            transcript.className = 'recognition-text command-detected';
                            setTimeout(() => {
                                transcript.className = 'recognition-text';
                            }, 1000);
                        } else {
                            transcript.className = 'recognition-text';
                        }
                    }

                    async function requestMicrophonePermission() {
                        try {
                            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                            stream.getTracks().forEach(track => track.stop());
                            hidePermissionRequest();
                            return true;
                        } catch (error) {
                            updateStatus(false, 'Microphone access denied. Please grant permission to use voice commands.');
                            return false;
                        }
                    }

                    function initializeRecognition() {
                        if ('webkitSpeechRecognition' in window) {
                            recognition = new webkitSpeechRecognition();
                        } else if ('SpeechRecognition' in window) {
                            recognition = new SpeechRecognition();
                        } else {
                            vscode.postMessage({ command: 'error', error: 'Speech recognition not supported' });
                            return false;
                        }

                        recognition.continuous = true;
                        recognition.interimResults = true;
                        recognition.lang = '${language}';

                        recognition.onresult = (event) => {
                            const transcript = Array.from(event.results)
                                .map(result => result[0])
                                .map(result => result.transcript)
                                .join('');

                            const now = Date.now();
                            const isFinal = event.results[0].isFinal;
                            
                            if (isFinal) {
                                // Check if enough time has passed since the last command
                                if (now - lastCommandTime >= commandTimeout) {
                                    vscode.postMessage({ 
                                        command: 'transcript', 
                                        text: transcript,
                                        timestamp: now
                                    });
                                    lastCommandTime = now;
                                }
                            } else {
                                updateTranscript(transcript);
                            }
                        };

                        recognition.onerror = (event) => {
                            if (event.error === 'not-allowed') {
                                showPermissionRequest();
                            }
                            vscode.postMessage({ command: 'error', error: event.error });
                        };

                        recognition.onend = () => {
                            if (isListening) {
                                recognition.start();
                            }
                        };

                        return true;
                    }

                    document.getElementById('requestPermission').addEventListener('click', async () => {
                        if (await requestMicrophonePermission()) {
                            if (!recognition && !initializeRecognition()) {
                                return;
                            }
                            isListening = true;
                            recognition.start();
                            updateStatus(true);
                        }
                    });

                    window.addEventListener('message', async event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'start':
                                if (!recognition && !initializeRecognition()) {
                                    return;
                                }
                                if (await requestMicrophonePermission()) {
                                    isListening = true;
                                    recognition.start();
                                    updateStatus(true);
                                }
                                break;
                            case 'stop':
                                isListening = false;
                                if (recognition) {
                                    recognition.stop();
                                }
                                updateStatus(false);
                                break;
                            case 'command-detected':
                                updateTranscript(message.text, true);
                                break;
                        }
                    });

                    vscode.postMessage({ command: 'ready' });
                </script>
            </body>
            </html>
        `;

        webview.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'transcript':
                    this.handleVoiceCommand(message.text, message.timestamp);
                    break;
                case 'error':
                    vscode.window.showErrorMessage(`Speech recognition error: ${message.error}`);
                    break;
                case 'ready':
                    this.recognition = webview;
                    break;
            }
        });

        return webview;
    }

    public startListening() {
        if (this.isListening) {
            return;
        }

        if (!this.recognition) {
            this.recognition = this.createWebview();
        }

        this.isListening = true;
        this.recognition.webview.postMessage({ command: 'start' });
        vscode.window.showInformationMessage('Voice commands activated');
    }

    public stopListening() {
        if (!this.isListening) {
            return;
        }

        this.isListening = false;
        if (this.recognition) {
            this.recognition.webview.postMessage({ command: 'stop' });
        }
        vscode.window.showInformationMessage('Voice commands deactivated');
    }

    private handleVoiceCommand(transcript: string, timestamp: number) {
        // Check if enough time has passed since the last command
        if (timestamp - this.lastCommandTime < this.commandTimeout) {
            return;
        }

        // Check if the transcript matches any command pattern
        for (const command of this.commands) {
            const match = transcript.match(command.pattern);
            if (match) {
                // Show visual feedback in the webview
                if (this.recognition) {
                    this.recognition.webview.postMessage({
                        command: 'command-detected',
                        text: transcript
                    });
                }
                
                command.action(transcript);
                this.lastCommandTime = timestamp;
                return;
            }
        }
    }

    private async handleCursorCommand(transcript: string) {
        // Extract the message after the greeting
        const message = transcript.replace(/^(hey cursor|yo cursor|hi cursor|hello cursor|hey assistant|yo assistant|hi assistant|hello assistant)\s*/i, '').trim();
        
        if (message) {
            // Focus the chat input
            await vscode.commands.executeCommand('cursor.chat.focus');
            
            // Get the active text editor
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                // Replace the current line with the message
                const line = editor.document.lineAt(editor.selection.active.line);
                await editor.edit(editBuilder => {
                    editBuilder.replace(line.range, message);
                });
            }
            
            vscode.window.showInformationMessage('Message ready. Say "Send to cursor" to send it.');
        }
    }

    private async handleSendToCursor() {
        try {
            // Focus the chat input first
            await vscode.commands.executeCommand('cursor.chat.focus');
            
            // Get the active text editor
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }

            // Get the current selection or the entire line if nothing is selected
            const selection = editor.selection;
            const text = selection.isEmpty
                ? editor.document.lineAt(selection.active.line).text
                : editor.document.getText(selection);

            if (!text.trim()) {
                vscode.window.showErrorMessage('No text selected or line is empty');
                return;
            }

            // Send the text to Cursor AI
            await vscode.commands.executeCommand('cursor.chat.send', text);
            vscode.window.showInformationMessage('Message sent to Cursor AI');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to send message to Cursor AI: ${error}`);
        }
    }
} 