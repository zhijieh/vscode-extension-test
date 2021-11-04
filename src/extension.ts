import * as vscode from 'vscode';
import server from './mywebsocket';
export function activate(context: vscode.ExtensionContext) {
	function showPreview(uri?: vscode.Uri) {
		let resource = uri;
		if (!(resource instanceof vscode.Uri)) {
		  if (vscode.window.activeTextEditor) {
			// we are relaxed and don't check for markdown files
			resource = vscode.window.activeTextEditor.document.uri;
		  }
		}
		// vscode.window.showInformationMessage(`文件url: ${resource}`);
		const text = (vscode.window.activeTextEditor as any).document.getText();
		if (validateJSON(text)) {
			// vscode.window.activeTextEditor?.document.save()
			// vscode.window.showInformationMessage(`文件内容合法，内容为: ${text}`);
			server.broadcast(text)
			// vscode.env.openExternal(vscode.Uri.parse('http://baidu.com'))
		}
	}
	function validateJSON(text: string) {
		let result
		try {
			result = JSON.parse(text)
			return true
		} catch (e) {
			vscode.window.showErrorMessage(`JSON输入格式不合法，请检查后预览！`);
			return false
		}
	}

	let disposable = vscode.commands.registerCommand('uijson.showPreview', showPreview);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
