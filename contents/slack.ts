

const SLACK_REDIRECT_TEXT = "デスクトップアプリにリダイレクトしました"
const TIMEOUT_MS = 5000 // 5秒

const observer = new MutationObserver((mutations, obs) => {
  const bodyText = document.body.innerText
  if (bodyText.includes(SLACK_REDIRECT_TEXT)) {
    console.log("Slack redirect text found. Closing tab.")
    // バックグラウンドスクリプトにタブを閉じるようメッセージを送信
    chrome.runtime.sendMessage({ action: "closeTab" })
    obs.disconnect() // 監視を停止
  }
})

// 監視を開始
observer.observe(document.body, {
  childList: true,
  subtree: true
})

// タイムアウトを設定
setTimeout(() => {
  console.log("Timeout reached. Disconnecting observer.")
  observer.disconnect()
}, TIMEOUT_MS)

// 初期状態で既にテキストが存在する場合もチェック
if (document.body.innerText.includes(SLACK_REDIRECT_TEXT)) {
  console.log("Slack redirect text found on initial load. Closing tab.")
  chrome.runtime.sendMessage({ action: "closeTab" })
  observer.disconnect()
}