const { app, BrowserWindow, screen, ipcMain, Menu, Tray} = require('electron');
const { attach, refresh } = require("electron-as-wallpaper");
const path = require('path');

// 
const Handler = require('./main/handler.js');
// import Handler from "./main/handler.mjs";
const { log } = require('console');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

async function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        // width: 1200,
        // height: 900,
        // x: 0,
        // y: 0,

        // 桌面挂件风格
        show: false,
        movable: false,
        resizable: false,
        // minimizable: true,   /* keep it true */
        // maximizable: false,
        // alwaysOnTop: false,
        frame: false,
        fullscreenable: false,
        transparent: true,
        autoHideMenuBar: true,

        titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // Event handler of mainWindow
    let handler = new Handler(mainWindow);

    // 创建托盘
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "注销",
            click: () => {
            console.log("注销");
            // 主进程发送消息，通知渲染进程注销当前登录用户 --todo
            },
        },
        {
            type: "separator", // 分割线
        },
        // 菜单项
        {
            label: "退出",
            role: "quit", // 使用内置的菜单行为，就不需要再指定 click 事件
        },
    ]);

    mainWindow.tray = new Tray(path.join(__dirname, "../assets/icons/calendar.png"));
    // 处理右键
    mainWindow.tray.on("right-click", () => {
        mainWindow.tray.popUpContextMenu(contextMenu);
    });


    const size = screen.getPrimaryDisplay().workAreaSize;
    const scale = screen.getPrimaryDisplay().scaleFactor;
    mainWindow.setBounds({x: 0, y: 0, width: size.width, height: size.height});

    
    // https://github.com/meslzy/electron-as-wallpaper/blob/main/exmaples/input-forwarding/index.js
    await mainWindow.loadFile(path.join(__dirname, 'index.html'));
    attach(mainWindow, {
        transparent: true,
        forwardMouseInput: true,
        // forwardKeyboardInput: true,
    });

    mainWindow.webContents.openDevTools({
        mode: "detach"
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
};

ipcMain.on('mw-open-editor', (event, bound, date, lines) => {
    if (this.editing) return;
    this.editing = true;
    
    // console.log(__dirname);
    console.log("Opening page: "+date);


    const editor = new BrowserWindow({
        show: false,
        frame: false,
        movable: false,
        resizable: false,
        minimizable: true, // need to be true
        maximizable: false,
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload_edit.js'),
        },
    });
    this.editor = editor;

    editor.setBounds(bound);
    editor.loadFile(path.join(__dirname, 'editing-page.html'));

    // 保持在桌面上方，防止被最小化
    editor.on('minimize', (e) => {
        e.preventDefault();
        //try changing delay value
        setTimeout(() => editor.restore(), 1);
    });
    editor.on('show', ()=>{
        editor.focus();
    });
    // editor.show();
    editor.on('ready-to-show', () => {
        editor.webContents.send('update-page', date, lines);
        editor.show();
        editor.setAlwaysOnTop(false);
    });
    editor.on('closed', () => {
        this.editing = false;
        this.editor = null;
    });

    // editor.webContents.openDevTools();
    editor.webContents.openDevTools({mode: "detach"});
});

// This method will be called when Electron has finished initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.on('quit', () => {
    refresh();
});

// Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    refresh();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});