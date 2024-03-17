import { reactive } from 'https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js?module';

class Calendar{
    constructor(){
        // properties
        this.mspd = 8.64e7; // milliseconds per day

        this.year = new Date().getFullYear();
        this.firstDate = new Date(this.year, 0, 1); // 20xx.1.1
        this.firstDay = this.date2day(this.firstDate); // which day in a week [0,6]
        this.zeroDate = new Date(this.firstDate - this.mspd * this.firstDay);
        
        this.lastDate = new Date(this.year, 11, 31);
        this.lastDay = this.date2day(this.lastDate);
        this.endDate = new Date(this.lastDate + this.mspd * (6 - this.lastDay));

        // reactive states
        this.sun_first = false;
        this.current = reactive({
            today: this.dateToStr_yyyymmdd(new Date()),
            week: this.getCurWeek(), // int
        });

        console.log(`[Calendar] ZeroDate:${this.zeroDate}`);
        console.log(`[Calendar] CurrentWeek:${this.current.week}`);

        this.requestUpdate();
    };

    requestUpdate(){
        let first = new Date(this.zeroDate*1. + 8.64e7 * 7 * this.current.week);
        let last = new Date(first*1. + 8.64e7 * 28);
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
        // console.log(startWeek);
        // console.log(rows);
        // console.log(weekList);
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
        return Math.floor(week)
    }
    isWeekday(date){
        let day = (date.getDay() + 6) % 7;
        return day < 5;
    }
    isToday(date){
        return this.dateToStr_yyyymmdd(date) === this.current.today;
    }
    backward = ()=>{
        this.current.week = this.current.week - 1;
        this.requestUpdate();
    }
    forward = ()=>{
        this.current.week = this.current.week + 1;
        this.requestUpdate();
    }
}

export default Calendar;