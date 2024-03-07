const { app, BrowserWindow, screen, ipcMain, Menu, Tray} = require('electron');
const path = require('path');
const fs = require('fs');
const { type } = require('os');
const { rejects } = require('assert');

const userDataPath = app.getPath('userData');
const filePath = "./data/diary.json";
const configPath = "./data/config.json";

function createFile() {
    // Get the directory portion of the file path
    const directory = filePath.split('/').slice(0, -1).join('/');

    // Check if directory exists, if not create it 
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive: true});
    }

    // Create blank file
    const data = {
        // "20240229":[
        //     {
        //         "innerText": "Hello world!",
        //         "sub": "In JavaScript",
        //         "color": "red",
        //         "font": "Arial",
        //         "size": "20",
        //         "italic": "false",
        //         "bold": "false",
        //         "underline": "false",
        //         "strike": "false",
        //     },
        //     {
        //         "innerText": "TODO",
        //         "sub": "commit the code.",
        //         "align": "left",
        //         "indent": "0",
        //         "bullet": "false",
        //         "number": "false",
        //         "image": "false",
        //         "link": "false",
        //         "video": "false",
        //         "audio": "false",
        //         "code": "false",
        //         "quote": "false",
        //         "list": "false",
        //         "table": "false",
        //         "formula": "false",
        //         "formula-inline": "false"
        //     ],
        // }
    };
    fs.writeFileSync(filePath, JSON.stringify(data), err => {
        if (err) throw err;
        console.log('File written');
    });
}

function readFile(first_date, last_date) {
    if (!fs.existsSync(filePath)) createFile();

    const data = fs.readFileSync(filePath);

    let diary = JSON.parse(data);
    
    return diary;
}

function updateFile(date, lines) {
    let diary = readFile();
    
    diary[date] = lines;

    fs.writeFileSync(filePath, JSON.stringify(diary), err => {
        if (err) throw err;
        console.log('File written');
    });
}

async function readFileAsync(first_date, last_date) {
    fs.readFile(filePath, (err, data) => {
        // File not found, create it
        if (err) createFile();
        
        let requested = [];
        dates.forEach(date => {
            if(date >= first_date && date <= last_date){
                let lines = diary[date];
                requested.push(lines);
            }
        });

        // send to renderer
        ipcMain.send('load-data', requested);   
    });
}

function dateToStr_YYYYMMDD(date){
    let yyyy = date.getFullYear().toString();
    let mm = (date.getMonth()+1).toString().padStart(2, '0'); 
    let dd = date.getDate().toString().padStart(2, '0');
    return yyyy + mm + dd;
}

class Handler{
    constructor(mainWindow){
        this.mainWindow = mainWindow;
        this.editing = false;
        this.editor = null; // editor window
            
        // ALl events main process receives
        ipcMain.on('request-calendar', (event, fd, ld) => {
            console.log('=> request-calendar');
            let res = this.loadData(fd, ld);
            this.mainWindow.webContents.send('update-calendar', res)
        });

        ipcMain.on('request-settings', (event, setting) => {
            console.log('=> request-settings');
            let scale = screen.getPrimaryDisplay().scaleFactor;
            this.mainWindow.webContents.send('update-settings', {scale});
        });

        ipcMain.on('save-editing', (event, date, lines) => {
            updateFile(date, lines);
        });

    }

    // 从文件中简要记录，并显示在page中
    loadData(first_date, last_date){
        let diary = readFile();

        // Select visible dates
        let requested = {};
        let dates = Object.keys(diary);
        dates.forEach(date => {
            if(date >= first_date && date <= last_date){
                requested[date] = diary[date];
            }
        });
        
        // Send to renderer process to update page.
        // this.mainWindow.webContents.send('update-calendar', requested);
        console.log(diary);
        return diary
    }


    // 更新记录文件
    saveData(date, updated){
        let diary = readFile();
        
        diary[date] = updated;

        fs.writeFileSync(filePath, diary, err => {
            if (err) throw err;
            console.log('File written successfully');
        });
    }

}

module.exports = Handler;
