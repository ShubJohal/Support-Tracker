const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, powerMonitor } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow
let tray

const dataPath = path.join(app.getPath('userData'), 'worklog-data.json')

function loadData() {
  try {
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf8')
      try {
        return JSON.parse(raw)
      } catch (e) {
        try {
          const backup = dataPath + '.corrupt.' + Date.now()
          fs.writeFileSync(backup, raw)
        } catch (_) {}
      }
    }
  } catch (e) {}
  return { clients: [], tasks: [] }
}

function saveData(data) {
  const tmp = dataPath + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, dataPath)
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 18 },
    backgroundColor: '#0f0f13',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  })

  mainWindow.loadFile('index.html')
  mainWindow.once('ready-to-show', () => mainWindow.show())
}

function setupTray() {
  if (process.platform !== 'darwin') return
  try {
    tray = new Tray(nativeImage.createEmpty())
    tray.setToolTip('WorkLog')
    updateTray(null)
  } catch (e) {}
}

function updateTray(info) {
  if (!tray) return
  try {
    if (info && info.name) {
      tray.setTitle(' ' + info.time)
      tray.setToolTip(info.name + (info.client ? ' (' + info.client + ')' : '') + ' — ' + info.time)
    } else {
      tray.setTitle('')
      tray.setToolTip('WorkLog — no active timer')
    }
    const items = [
      { label: info && info.name ? info.name + ' — ' + info.time : 'No active timer', enabled: false },
      { type: 'separator' }
    ]
    if (info && info.name) {
      items.push({ label: 'Pause', click: () => mainWindow && mainWindow.webContents.send('tray-action', 'pause') })
      items.push({ label: 'Stop', click: () => mainWindow && mainWindow.webContents.send('tray-action', 'stop') })
    }
    items.push({ label: 'Show WorkLog', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus() } } })
    items.push({ type: 'separator' })
    items.push({ label: 'Quit', click: () => app.quit() })
    tray.setContextMenu(Menu.buildFromTemplate(items))
  } catch (e) {}
}

app.whenReady().then(() => {
  createWindow()
  setupTray()

  powerMonitor.on('suspend', () => {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('system-idle', 'suspend')
  })
  powerMonitor.on('lock-screen', () => {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('system-idle', 'lock')
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('load-data', () => loadData())
ipcMain.handle('save-data', (_, data) => {
  try { saveData(data); return true }
  catch (e) { return false }
})
ipcMain.handle('update-tray', (_, info) => { updateTray(info); return true })
