const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  updateTray: (info) => ipcRenderer.invoke('update-tray', info),
  onSystemIdle: (cb) => ipcRenderer.on('system-idle', (_, reason) => cb(reason)),
  onTrayAction: (cb) => ipcRenderer.on('tray-action', (_, action) => cb(action))
})
