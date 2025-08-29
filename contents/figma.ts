import type { PlasmoCSConfig } from "plasmo"

import { POLLING_INTERVAL_MS, TIMEOUT_MS } from "~/lib/constants"

export const config: PlasmoCSConfig = {
  matches: ["*://*.figma.com/*"]
}

const FIGMA_REDIRECT_TEXT_JP = "Figmaアプリで開きました"
const FIGMA_REDIRECT_TEXT_EN_REGEX = /Opened “.*” in Figma app/

const main = () => {
  const intervalId = setInterval(() => {
    const bodyText = document.body.innerText
    if (
      bodyText.includes(FIGMA_REDIRECT_TEXT_JP) ||
      FIGMA_REDIRECT_TEXT_EN_REGEX.test(bodyText)
    ) {
      chrome.runtime.sendMessage({ action: "closeTab" })
      clearInterval(intervalId)
    }
  }, POLLING_INTERVAL_MS)

  setTimeout(() => {
    clearInterval(intervalId)
  }, TIMEOUT_MS)
}

chrome.storage.sync.get("appSettings", (data) => {
  if (data.appSettings && data.appSettings.figma) {
    main()
  }
})
