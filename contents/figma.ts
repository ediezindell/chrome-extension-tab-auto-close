import type { PlasmoCSConfig } from "plasmo"

// このコンテントスクリプトをFigmaのページでのみ動作させる
export const config: PlasmoCSConfig = {
  matches: ["*://*.figma.com/*"]
}

const FIGMA_REDIRECT_TEXT = "Figmaアプリで開きました"
const POLLING_INTERVAL_MS = 200 // 0.2秒ごとにチェック
const TIMEOUT_MS = 5000 // 5秒でタイムアウト

const main = () => {
  const intervalId = setInterval(() => {
    const bodyText = document.body.innerText
    if (bodyText.includes(FIGMA_REDIRECT_TEXT)) {
      // テキストを見つけたら、タブを閉じるメッセージを送信してインターバルを停止
      chrome.runtime.sendMessage({ action: "closeTab" })
      clearInterval(intervalId)
    }
  }, POLLING_INTERVAL_MS)

  // タイムアウトを設定して、一定時間後にインターバルを確実に停止させる
  setTimeout(() => {
    clearInterval(intervalId)
  }, TIMEOUT_MS)
}

// 最初に設定を読み込み、機能が有効な場合のみmain()を実行
chrome.storage.sync.get("appSettings", (data) => {
  if (data.appSettings && data.appSettings.figma) {
    main()
  }
});