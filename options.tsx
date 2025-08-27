
import { useStorage } from "@plasmohq/storage"
import React from "react"

// 設定の型定義
interface AppSettings {
  slack: boolean
  figma: boolean
}

function Options() {
  // useStorageフックで設定を管理
  // 第一引数: ストレージのキー
  // 第二引数: 初期値
  const [settings, setSettings] = useStorage<AppSettings>("appSettings", (v) =>
    v === undefined ? { slack: true, figma: false } : v
  )

  // トグル操作時の処理
  const handleToggle = (app: keyof AppSettings) => {
    setSettings({ ...settings, [app]: !settings[app] })
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
