// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { VoiceRecognitionService } from './voiceRecognitionService';

let voiceService: VoiceRecognitionService;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	voiceService = new VoiceRecognitionService(context);
	await voiceService.initialize();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cursor-voice-attempt-3" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let startCommand = vscode.commands.registerCommand('cursor-voice.startVoiceCommands', () => {
		voiceService.startListening();
	});

	let stopCommand = vscode.commands.registerCommand('cursor-voice.stopVoiceCommands', () => {
		voiceService.stopListening();
	});

	context.subscriptions.push(startCommand, stopCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (voiceService) {
		voiceService.stopListening();
	}
}
