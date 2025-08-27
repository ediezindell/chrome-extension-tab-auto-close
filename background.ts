// バックグラウンドスクリプト

// 拡張機能インストール時の初期設定
chrome.runtime.onInstalled.addListener(() => {
  // デフォルトでSlackは有効、Figmaは無効に
  chrome.storage.sync.set({ appSettings: { slack: true, figma: false } });
});

// 拡張機能アイコンクリックでオプションページを開く
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// タブの状態が更新されたときに発火
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // ページの読み込みが完了し、URLが存在する場合
  if (changeInfo.status === 'complete' && tab.url) {
    // 設定を読み込む
    chrome.storage.sync.get("appSettings", (data) => {
      const settings = data.appSettings;
      // Slackの設定が有効で、URLがSlackの場合
      if (settings && settings.slack && tab.url.includes('app.slack.com')) {
        // コンテントスクリプトを注入
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['contents/slack.js'], // PlasmoはJSにコンパイルする
        });
      }
      // TODO: Figmaのロジックもここに追加
    });
  }
});

// コンテントスクリプトからのメッセージをリッスン
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "closeTab" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
});