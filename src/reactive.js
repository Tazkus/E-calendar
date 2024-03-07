// Renderer (Main World)

// import { createApp } from 'https://unpkg.com/petite-vue?module'
import { createApp } from 'https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js?module';
// import { createApp, reactive } from 'vue';
// import { createApp, reactive } from 'https://unpkg.com/vue@3.4.21/dist/vue.global.js';

import Calendar from './modules/calendar.js';
// import Notepad from './modules/notepad.js';
import Editor from './modules/editor.js';

let calendar = new Calendar(2024);
// let editor = new Editor();

// 还原“桌面日历”功能的代码（已弃用）
// let notepad = new Notepad();
// document.addEventListener('DOMContentLoaded', notepad.mount);

function openSettings(){
    // window.open('./settings.html', '_blank', 'nodeIntegration=no');
    window.open('./settings.html', '_blank', 'nodeIntegration=no');
}

// 从 main.js获取设备信息
let scale;

// 设置与主程序的通信机制
console.log('request-settings');
window.myapi.requestSettings({});
window.myapi.onUpdateSettings((setting) => {
    scale = setting.scale;
    // console.log(scale);
    document.body.style.setProperty("--px-space", (1 / scale)+'px');
    document.body.style.setProperty("--px-big-space", (3 / scale)+'px');
})



createApp({
    // 在具有v-scope属性的元素中可用
    // 可以是变量、方法，或本身包含变量与方法的对象
    test: "今晩は",
    chromeVer: window.myapi.chrome(),
    openSettings: openSettings,
    calendar: calendar,
    editor: Editor,
    scale: scale,
    
    // 组件方法
    demo: ()=>{
        return {$template: '#demo'}
    },
    CalendarView: ()=>{
        return {
            $template: '#CalendarView',
            // 方法
            today: calendar.dateToStr_Full(new Date()),
            colList: calendar.getColList(),
            isWeekday: calendar.isWeekday,
            // 响应式数据
            curWeek: calendar.curWeek,
            roundedHeight: '150px',
            roundedWidth: '846px',
            // weeks: calendar.getRowList(calendar.curWeek(), 4),
        }
    },
}).mount()

// 根据宽高比添加将渐变角度设置为css自定义属性

function setGradientDeg(selector){
    console.log(selector);
    let element, elements;
    if(selector.charAt(0) === '.'){
        elements = document.getElementsByClassName(selector.slice(1));
        for(let i=0; i<elements.length; i++){
            element = elements[i];
            _setGradientDeg(element);
        }
    };
    if(selector.charAt(0) === '#'){
        element = document.getElementById(selector.slice(1));
        _setGradientDeg(element);
    };
}
function _setGradientDeg(element){
    let whratio = element.offsetWidth / element.offsetHeight;
    let deg = -Math.atan(whratio) / Math.PI * 180;
    let style =     
    `linear-gradient(
        ${deg}deg,
        hsl(000deg, 0%, 79%, 0.10) 0%,
        hsl(344deg, 0%, 81%, 0.10) 21%,
        hsl(344deg, 0%, 83%, 0.10) 30%,
        hsl(344deg, 0%, 86%, 0.10) 39%,
        hsl(344deg, 0%, 88%, 0.10) 46%,
        hsl(344deg, 0%, 90%, 0.10) 54%,
        hsl(344deg, 0%, 93%, 0.10) 61%,
        hsl(344deg, 0%, 95%, 0.10) 69%,
        hsl(344deg, 0%, 98%, 0.10) 79%,
        hsl(000deg, 0%, 100%, 0.10) 100%)`;
    // element.setAttribute('gradient-deg', deg);
    element.style.setProperty('background-image', style); 
}


setGradientDeg('#calendar-top-banner');
setGradientDeg('.calendar-day-title-tab');
setGradientDeg('.calendar-page');
setGradientDeg('.week-tab');