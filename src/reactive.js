// Renderer (Main World)
let scale;
window.myapi.requestSettings({});
window.myapi.onReceiveSettings((setting) => {
    scale = setting.scale;
    document.body.style.setProperty("--px-space", (1 / scale)+'px');
    document.body.style.setProperty("--px-big-space", (3 / scale)+'px');
})
window.myapi.onEditorClose(()=>{
    calendar.requestUpdate();
});
window.myapi.onReceiveCalendar((requested) => {
    loadPages(requested);
});

// document.addEventListener('DOMContentLoaded', ()=>{
//     let pages = document.getElementsByClassName("calendar-page");
//     for(let i=0; i<pages.length; i++){
//         const page = pages[i];
//         page.addEventListener("dblclick", openPage);
//     }
// }, {once:true});

// import { createApp } from 'https://unpkg.com/petite-vue?module'
import { createApp } from 'https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js?module';
import Calendar from './modules/calendar.js';
import {openPage, loadPages} from './modules/editor.js';
let calendar = new Calendar();

createApp({
    // available to all v-scope element
    chromeVer: window.myapi.chrome(),
    calendar: calendar,
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
            openPage: openPage,
        }
    },
}).mount()

import {setGradientDeg} from './styling.js';
setGradientDeg('#calendar-top-banner');
setGradientDeg('.calendar-day-title-tab');
setGradientDeg('.calendar-page');
setGradientDeg('.week-tab');

// import { createApp, reactive } from 'vue';
// import { createApp, reactive } from 'https://unpkg.com/vue@3.4.21/dist/vue.global.js';
// import { createApp, reactive } from './vue.esm-browser.js';
// import calendar from './components/calendar.vue';
// const app = createApp(calendar);
// app.mount("#calendar-container");
``
// 还原“桌面日历”功能的代码（已弃用）
// let notepad = new Notepad();
// document.addEventListener('DOMContentLoaded', notepad.mount);