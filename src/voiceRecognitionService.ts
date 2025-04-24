import * as vscode from 'vscode';

export class VoiceRecognitionService {
    private recognition: vscode.WebviewPanel | null = null;
    private isListening: boolean = false;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
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
                enableScripts: true
            }
        );

        webview.webview.html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                </style>
            </head>
            <body>
                <div id="status" class="status stopped">Voice recognition stopped</div>
                <div id="transcript"></div>
                <script>
                    const vscode = acquireVsCodeApi();
                    let recognition;
                    let isListening = false;

                    function updateStatus(listening) {
                        const status = document.getElementById('status');
                        status.className = 'status ' + (listening ? 'listening' : 'stopped');
                        status.textContent = listening ? 'Listening...' : 'Voice recognition stopped';
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

                            if (event.results[0].isFinal) {
                                vscode.postMessage({ command: 'transcript', text: transcript });
                            }
                        };

                        recognition.onerror = (event) => {
                            vscode.postMessage({ command: 'error', error: event.error });
                        };

                        recognition.onend = () => {
                            if (isListening) {
                                recognition.start();
                            }
                        };

                        return true;
                    }

                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'start':
                                if (!recognition && !initializeRecognition()) {
                                    return;
                                }
                                isListening = true;
                                recognition.start();
                                updateStatus(true);
                                break;
                            case 'stop':
                                isListening = false;
                                if (recognition) {
                                    recognition.stop();
                                }
                                updateStatus(false);
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
                    this.handleVoiceCommand(message.text);
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

    private handleVoiceCommand(transcript: string) {
        // Process the voice command and interact with Cursor AI
        vscode.window.showInformationMessage(`Voice command: ${transcript}`);
        // TODO: Implement Cursor AI interaction
    }
} 