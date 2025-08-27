
// バックグラウンドスクリプト

// 拡張機能インストール時の初期設定
chrome.runtime.onInstalled.addListener(() => {
  // デフォルトでSlackは有効、Figmaは無効に
  chrome.storage.sync.set({ appSettings: { slack: true, figma: true, teams: true } });
});

// 拡張機能アイコンクリックでオプションページを開く
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// コンテントスクリプトからのメッセージをリッスンし、タブを閉じる
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "closeTab" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
});
