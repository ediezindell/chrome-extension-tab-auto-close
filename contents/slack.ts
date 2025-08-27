import type { PlasmoCSConfig } from "plasmo"

// このコンテントスクリプトをSlackのページでのみ動作させる
export const config: PlasmoCSConfig = {
  matches: ["https://app.slack.com/*"]
}

const SLACK_REDIRECT_TEXT = "デスクトップアプリにリダイレクトしました"
const TIMEOUT_MS = 5000 // 5秒

// メインの処理
const main = () => {
  const observer = new MutationObserver((mutations, obs) => {
    const bodyText = document.body.innerText
    if (bodyText.includes(SLACK_REDIRECT_TEXT)) {
      chrome.runtime.sendMessage({ action: "closeTab" })
      obs.disconnect()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  setTimeout(() => observer.disconnect(), TIMEOUT_MS)

  if (document.body.innerText.includes(SLACK_REDIRECT_TEXT)) {
    chrome.runtime.sendMessage({ action: "closeTab" })
    observer.disconnect()
  }
}

// 最初に設定を読み込み、機能が有効な場合のみmain()を実行
chrome.storage.sync.get("appSettings", (data) => {
  if (data.appSettings && data.appSettings.slack) {
    main()
  }
});