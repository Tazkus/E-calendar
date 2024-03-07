"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Window = exports.windowsCfg = void 0;
// electron-main/window.ts
var electron_1 = require("electron");
var path_1 = require("path");
// 新建窗口时可以传入的一些options配置项
exports.windowsCfg = {
    id: null, //唯一 id
    title: "", //窗口标题
    width: null, //宽度
    height: null, //高度
    minWidth: null, //最小宽度
    minHeight: null, //最小高度
    route: "", // 页面路由 URL '/manage?id=123'
    resizable: true, //是否支持调整窗口大小
    maximize: false, //是否最大化
    backgroundColor: "#eee", //窗口背景色
    data: null, //数据
    isMultiWindow: false, //是否支持多开窗口 (如果为 false，当窗体存在，再次创建不会新建一个窗体 只 focus 显示即可，，如果为 true，即使窗体存在，也可以新建一个)
    isMainWin: false, //是否主窗口(当为 true 时会替代当前主窗口)
    parentId: null, //父窗口 id  创建父子窗口 -- 子窗口永远显示在父窗口顶部 【父窗口可以操作】
    modal: false, //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
};
/**
 * 窗口配置
 */
var Window = /** @class */ (function () {
    function Window() {
        this.main = null; //当前页
        this.group = {}; //窗口组
        this.tray = null; //托盘
    }
    // 窗口配置
    Window.prototype.winOpts = function (wh) {
        if (wh === void 0) { wh = []; }
        return {
            width: wh[0],
            height: wh[1],
            backgroundColor: "#f7f8fc",
            autoHideMenuBar: true,
            resizable: true,
            minimizable: true,
            maximizable: true,
            frame: true,
            show: false,
            minWidth: 0,
            minHeight: 0,
            modal: true,
            webPreferences: {
                contextIsolation: false, //上下文隔离
                nodeIntegration: true, //启用 Node 集成（是否完整的支持 node）
                webSecurity: false,
                preload: path_1.default.join(__dirname, "../electron-preload/index.js"),
            },
        };
    };
    // 获取窗口
    Window.prototype.getWindow = function (id) {
        return electron_1.BrowserWindow.fromId(id);
    };
    // 创建窗口
    Window.prototype.createWindows = function (options) {
        console.log("------------开始创建窗口...");
        var args = Object.assign({}, exports.windowsCfg, options);
        // 判断窗口是否存在
        for (var i in this.group) {
            if (this.getWindow(Number(i)) &&
                this.group[i].route === args.route &&
                !this.group[i].isMultiWindow) {
                console.log("窗口已经存在了");
                this.getWindow(Number(i)).focus();
                return;
            }
        }
        // 创建 electron 窗口的配置参数
        var opt = this.winOpts([args.width || 390, args.height || 590]);
        // 判断是否有父窗口
        if (args.parentId) {
            console.log("parentId：" + args.parentId);
            opt.parent = this.getWindow(args.parentId); // 获取主窗口
        }
        else if (this.main) {
            console.log('当前为主窗口');
        } // 还可以继续做其它判断
        // 根据传入配置项，修改窗口的相关参数
        opt.modal = args.modal;
        opt.resizable = args.resizable; // 窗口是否可缩放
        if (args.backgroundColor)
            opt.backgroundColor = args.backgroundColor; // 窗口背景色
        if (args.minWidth)
            opt.minWidth = args.minWidth;
        if (args.minHeight)
            opt.minHeight = args.minHeight;
        var win = new electron_1.BrowserWindow(opt);
        console.log("窗口 id：" + win.id);
        this.group[win.id] = {
            route: args.route,
            isMultiWindow: args.isMultiWindow,
        };
        // 是否最大化
        if (args.maximize && args.resizable) {
            win.maximize();
        }
        // 是否主窗口
        if (args.isMainWin) {
            if (this.main) {
                console.log("主窗口存在");
                delete this.group[this.main.id];
                this.main.close();
            }
            this.main = win;
        }
        args.id = win.id;
        win.on("close", function () { return win.setOpacity(0); });
        // 打开网址（加载页面）
        var winURL;
        if (electron_1.app.isPackaged) {
            winURL = args.route
                ? "app://./index.html".concat(args.route)
                : "app://./index.html";
        }
        else {
            winURL = args.route
                ? "http://".concat(process.env["VITE_DEV_SERVER_HOST"], ":").concat(process.env["VITE_DEV_SERVER_PORT"]).concat(args.route, "?winId=").concat(args.id)
                : "http://".concat(process.env["VITE_DEV_SERVER_HOST"], ":").concat(process.env["VITE_DEV_SERVER_PORT"], "?winId=").concat(args.id);
        }
        console.log("新窗口地址:", winURL);
        win.loadURL(winURL);
        win.once("ready-to-show", function () {
            win.show();
        });
    };
    // 创建托盘
    Window.prototype.createTray = function () {
        var _this = this;
        console.log("创建托盘");
        var contextMenu = electron_1.Menu.buildFromTemplate([
            {
                label: "注销",
                click: function () {
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
        this.tray = new electron_1.Tray(path_1.default.join(__dirname, "../favicon.ico")); // 图标
        // 点击托盘显示窗口
        this.tray.on("click", function () {
            for (var i in _this.group) {
                if (_this.group[i])
                    _this.getWindow(Number(i)).show();
            }
        });
        // 处理右键
        this.tray.on("right-click", function () {
            var _a;
            (_a = _this.tray) === null || _a === void 0 ? void 0 : _a.popUpContextMenu(contextMenu);
        });
        this.tray.setToolTip("小猪课堂");
    };
    // 开启监听
    Window.prototype.listen = function () {
        var _this = this;
        // 固定
        electron_1.ipcMain.on('pinUp', function (event, winId) {
            event.preventDefault();
            if (winId && _this.main.id == winId) {
                var win = _this.getWindow(Number(_this.main.id));
                if (win.isAlwaysOnTop()) {
                    win.setAlwaysOnTop(false); // 取消置顶
                }
                else {
                    win.setAlwaysOnTop(true); // 置顶
                }
            }
        });
        // 隐藏
        electron_1.ipcMain.on("window-hide", function (event, winId) {
            if (winId) {
                _this.getWindow(Number(winId)).hide();
            }
            else {
                for (var i in _this.group) {
                    if (_this.group[i])
                        _this.getWindow(Number(i)).hide();
                }
            }
        });
        // 显示
        electron_1.ipcMain.on("window-show", function (event, winId) {
            if (winId) {
                _this.getWindow(Number(winId)).show();
            }
            else {
                for (var i in _this.group) {
                    if (_this.group[i])
                        _this.getWindow(Number(i)).show();
                }
            }
        });
        // 最小化
        electron_1.ipcMain.on("mini", function (event, winId) {
            console.log("最小化窗口 id", winId);
            if (winId) {
                _this.getWindow(Number(winId)).minimize();
            }
            else {
                for (var i in _this.group) {
                    if (_this.group[i]) {
                        _this.getWindow(Number(i)).minimize();
                    }
                }
            }
        });
        // 最大化
        electron_1.ipcMain.on("window-max", function (event, winId) {
            if (winId) {
                _this.getWindow(Number(winId)).maximize();
            }
            else {
                for (var i in _this.group)
                    if (_this.group[i])
                        _this.getWindow(Number(i)).maximize();
            }
        });
        // 创建窗口
        electron_1.ipcMain.on("window-new", function (event, args) { return _this.createWindows(args); });
    };
    return Window;
}());
exports.Window = Window;
