const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myapi', {  
  onReceivePage: (callback) => ipcRenderer.on('update-page', (_event, date, lines) => callback(date, lines)),
  saveEditing: (date, lines) => ipcRenderer.send('save-editing', date, lines),
})

  