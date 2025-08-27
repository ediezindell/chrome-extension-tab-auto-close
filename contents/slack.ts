import type { PlasmoCSConfig } from "plasmo"
import { POLLING_INTERVAL_MS, TIMEOUT_MS } from "~/lib/constants"

// このコンテントスクリプトをSlackのページでのみ動作させる
export const config: PlasmoCSConfig = {
  matches: ["*://*.slack.com/*"]
}

const SLACK_REDIRECT_TEXT = "デスクトップアプリにリダイレクトしました"

const main = () => {
  const intervalId = setInterval(() => {
    const bodyText = document.body.innerText
    if (bodyText.includes(SLACK_REDIRECT_TEXT)) {
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
  if (data.appSettings && data.appSettings.slack) {
    main()
  }
});