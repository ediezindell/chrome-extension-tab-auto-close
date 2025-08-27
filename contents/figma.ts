
import type { PlasmoCSConfig } from "plasmo"

// このコンテントスクリプトをFigmaのページでのみ動作させる
export const config: PlasmoCSConfig = {
  matches: ["*://*.figma.com/*"]
}

const FIGMA_REDIRECT_TEXT = "Figmaアプリで開きました"
const TIMEOUT_MS = 5000 // 5秒

const main = () => {
  const observer = new MutationObserver((mutations, obs) => {
    const bodyText = document.body.innerText
    if (bodyText.includes(FIGMA_REDIRECT_TEXT)) {
      chrome.runtime.sendMessage({ action: "closeTab" })
      obs.disconnect()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  setTimeout(() => observer.disconnect(), TIMEOUT_MS)

  // 初期状態で既にテキストが存在する場合もチェック
  if (document.body.innerText.includes(FIGMA_REDIRECT_TEXT)) {
    chrome.runtime.sendMessage({ action: "closeTab" })
    observer.disconnect()
  }
}

// 最初に設定を読み込み、機能が有効な場合のみmain()を実行
chrome.storage.sync.get("appSettings", (data) => {
  if (data.appSettings && data.appSettings.figma) {
    main()
  }
});
