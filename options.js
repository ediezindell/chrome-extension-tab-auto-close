const apps = ['slack', 'figma', 'teams'];

// 読み込み時に設定を反映
chrome.storage.sync.get('appSettings', (data) => {
  const settings = data.appSettings || { slack: true, figma: true, teams: true };
  apps.forEach(app => {
    document.getElementById(app).checked = !!settings[app];
  });
});

// チェックボックスの変更を保存
apps.forEach(app => {
  document.getElementById(app).addEventListener('change', (e) => {
    chrome.storage.sync.get('appSettings', (data) => {
      const settings = data.appSettings || { slack: true, figma: true, teams: true };
      settings[app] = e.target.checked;
      chrome.storage.sync.set({ appSettings: settings });
    });
  });
});
