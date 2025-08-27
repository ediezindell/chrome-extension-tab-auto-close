import React, { useState, useEffect } from "react"

// 設定の型定義
interface AppSettings {
  slack: boolean
  figma: boolean
}

function Options() {
  const [settings, setSettings] = useState<AppSettings>({ slack: true, figma: false })

  // 起動時にストレージから設定を読み込む
  useEffect(() => {
    chrome.storage.sync.get("appSettings", (data) => {
      if (data.appSettings) {
        setSettings(data.appSettings)
      }
    })
  }, [])

  // 設定が変更されたらストレージに保存
  const handleToggle = (app: keyof AppSettings) => {
    const newSettings = { ...settings, [app]: !settings[app] }
    setSettings(newSettings)
    chrome.storage.sync.set({ appSettings: newSettings })
  }

  return (
    <div style={{ padding: "20px", width: "300px" }}>
      <h1>Auto Close Tab Settings</h1>
      <p>Select which applications should have their tabs closed automatically.</p>
      <div style={{ marginTop: "20px" }}>
        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "16px" }}>
          <span>Slack</span>
          <input
            type="checkbox"
            checked={settings.slack}
            onChange={() => handleToggle("slack")}
          />
        </label>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "16px" }}>
          <span>Figma (coming soon)</span>
          <input
            type="checkbox"
            checked={settings.figma}
            onChange={() => handleToggle("figma")}
            disabled
          />
        </label>
      </div>
    </div>
  )
}

export default Options