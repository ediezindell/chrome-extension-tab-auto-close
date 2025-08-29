import type { PlasmoCSConfig } from "plasmo"

import { POLLING_INTERVAL_MS, TIMEOUT_MS } from "~/lib/constants"

export const config: PlasmoCSConfig = {
  matches: ["*://teams.microsoft.com/*"]
}

const REDIRECT_TEXTS = ["Teams 会議に参加", "Join your Microsoft Teams Meeting"]

const main = () => {
  const intervalId = setInterval(() => {
    const bodyText = document.body.innerText
    if (REDIRECT_TEXTS.some((text) => bodyText.includes(text))) {
      chrome.runtime.sendMessage({ action: "closeTab" })
      clearInterval(intervalId)
    }
  }, POLLING_INTERVAL_MS)

  setTimeout(() => {
    clearInterval(intervalId)
  }, TIMEOUT_MS)
}

chrome.storage.sync.get("appSettings", (data) => {
  if (data.appSettings && data.appSettings.teams) {
    main()
  }
})
