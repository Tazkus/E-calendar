// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require('electron')
// const vue = require('vue');

contextBridge.exposeInMainWorld('myapi', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  // 除函数之外，我们也可以暴露变量
  // vue: vue,
  ipcRenderer: ipcRenderer,
})

  