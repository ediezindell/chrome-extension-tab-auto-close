
import type { PlasmoCSConfig } from "plasmo"
import { POLLING_INTERVAL_MS, TIMEOUT_MS } from "~/lib/constants"

// このコンテントスクリプトをTeamsのページでのみ動作させる
export const config: PlasmoCSConfig = {
  matches: ["*://teams.microsoft.com/*"]
}

const TEAMS_REDIRECT_TEXTS = [
  "Teams 会議に参加",
  "Join your Microsoft Teams Meeting"
]

const main = () => {
  const intervalId = setInterval(() => {
    const bodyText = document.body.innerText
    if (TEAMS_REDIRECT_TEXTS.some((text) => bodyText.includes(text))) {
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
  if (data.appSettings && data.appSettings.teams) {
    main()
  }
});
