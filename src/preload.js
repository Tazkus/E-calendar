// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myapi', {
  document: document,
  ipcRenderer: ipcRenderer,
  
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),

  // Renderer Receive
  onEvent: (event_name, callback) => ipcRenderer.on(event_name, (_event, value) => callback(value)),
  // receiving data from main
  
  // Renderer
  send: (channel, ...value) => ipcRenderer.send(channel, ...value),
    
  // Main Window
  onReceiveSettings: (callback) => ipcRenderer.on('update-settings', (_event, value) => callback(value)),
  onReceiveCalendar: (callback) => ipcRenderer.on('update-calendar', (_event, value) => callback(value)),
  onEditorClose: (callback) => ipcRenderer.on('editor-closed', (_event, value) => callback(value)),
  requestSettings: (settings) => ipcRenderer.send('request-settings', settings),
  requestCalendar: (first_date, last_date) => ipcRenderer.send('request-calendar', first_date, last_date),
  openEditing: (bound, date, lines) => ipcRenderer.send('mw-open-editor', bound, date, lines),
  
  // Editor Window
  onReceivePage: (callback) => ipcRenderer.on('update-page', (_event, date, lines) => callback(date, lines)),
  saveEditing: (date, lines) => ipcRenderer.send('save-editing', date, lines),
})

  