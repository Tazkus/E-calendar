import { reactive } from 'https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js?module';

class Calendar{
    constructor(year){
        // properties
        this.mspd = 8.64e7; // milliseconds per day
        this.firstDate = new Date(year, 0, 1); // 20xx.1.1
        this.firstDay = this.date2day(this.firstDate); // which day in a week ()
        this.zeroDate = new Date(this.firstDate - this.mspd * this.firstDay);
        
        this.lastDate = new Date(year, 11, 31);
        this.lastDay = this.date2day(this.lastDate);
        // this.endDate = 

        // reactive states
        this.year = year;
        this.sun_first = false;
        this.curWeek = reactive(this.getCurWeek());

        // 启动时读取

        console.log(this.zeroDate);
        this.requestUpdate();
    };

    requestUpdate(){
        let first = new Date(this.zeroDate*1. + 8.64e7 * 7 * this.curWeek);
        let last = new Date(first*1. + 8.64e7 * 28);
        console.log(first);
        console.log(last);
        let first_date = this.dateToStr_yyyymmdd(first);
        let last_date = this.dateToStr_yyyymmdd(last);
        // ipcRenderer.send('request-update', first_date, last_date);
        window.myapi.requestCalendar(first_date, last_date);
    }

    // Methods
    date2day(date){
        let day = date.getDay();
        if (!this.sun_first) day = (day+6) % 7;
        return day
    };
    
    dateToStr_Full(date){
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }

    dateToStr_yyyymmdd(date){
        let yyyy = date.getFullYear().toString();
        let mm = (date.getMonth()+1).toString().padStart(2, '0'); 
        let dd = date.getDate().toString().padStart(2, '0');
        return yyyy + mm + dd;
    }


    // 获取 星期 列表，用作列号
    getColList(){
        const dayList = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
        if(this.sun_first) dayList.unshift(dayList.pop());
        return dayList
    }

    // 获取当前视图下的 周序号 列表，用作行号
    getRowList(startWeek, rows){
        let weekList = [];
        for(let i=0;i<rows;i++){
            weekList.push(startWeek + i);
        }
        console.log(startWeek);
        console.log(rows);
        console.log(weekList);
        return weekList
    }

    // 获取当前行的 日期 列表
    getDateList(week){
        let startDate = this.zeroDate*1. + week * 7 * this.mspd;
        let dateList = [];
        for(let i=0; i<7; i++) {
            let dd = new Date(startDate*1. + i*this.mspd);
            dateList.push(dd);
        };

        return dateList;
    }

    getCurWeek(){
        let date = new Date();
        let week = (date - this.zeroDate) / this.mspd / 7;
        console.log(week);
        return Math.floor(week)
    }
    isWeekday(date){
        let day = (date.getDay()+6)%7;
        return day<5;
    }
    scrollup = ()=>{
        this.curWeek--;
        console.log(this.curWeek);
    }
    scrolldown = ()=>{
        this.curWeek++;
        console.log(this.curWeek);
    }
}

export default Calendar;