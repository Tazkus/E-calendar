<script setup>
  import { ref } from 'vue';
  
  const mspd = 8.64e7; // milliseconds in 24h
  
  function date2day(date) {
    let day = date.getDay();
    if (!this.sun_first) day = (day+6) % 7;
    return day;
  }
  function dateToStr_Full(date){
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  }
  function dateToStr_yyyymmdd(date){
    let yyyy = date.getFullYear().toString();
    let mm = (date.getMonth()+1).toString().padStart(2, '0'); 
    let dd = date.getDate().toString().padStart(2, '0');
    return yyyy + mm + dd;
  }

  // day is 0~6
  let year = new Date().getFullYear;
  let firstDate = new Date(year, 0, 1);
  let firstDay = date2day(firstDate);
  let zeroDate = new Date(firstDate - mspd * firstDay);
  
  let lastDate = new Date(year, 11, 31)
  let lastDay = date2day(lastDate);
  let endDate = new Date(lastDate + mspd * (6 - lastDay));

  let curWeek = ref(0);
  
  function requestUpdate(){
    let first = new Date(zeroDate*1. + mspd * 7 * curWeek);
    let last = new Date(first*1. + mspd * 28);
    let first_date = dateToStr_yyyymmdd(first);
    let last_date = dateToStr_yyyymmdd(last);
    // ipcRenderer.send('request-update', first_date, last_date);
    window.myapi.requestCalendar(first_date, last_date);
  }
  function forward() { 
    curWeek.value++;
    requestUpdate();
  }
  function backward() {
    curWeek.value--;
    requestUpdate();
  }
  function getCurWeek() {
    let date = new Date();
    let week = (date - zeroDate) / mspd / 7;
    curWeek = Math.floor(week);
  }
  function isWeekday(date) {
    let day = (date.getDay() + 6) % 7;
    return day < 5;
  }
  function getDateList(week) {
    let startDate = zeroDate*1. + week * 7 * mmm;
    let dateList = [];
    for(let i=0; i<7; i++) {
        let dd = new Date(startDate*1. + i*mmm);
        dateList.push(dd);
    };
    return dateList;
  }
  function getColList() {
    const dayList = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
    if(this.sun_first) dayList.unshift(dayList.pop());
    return dayList
  }
  function getRowList(startWeek, rows){
    let weekList = [];
    for(let i=0;i<rows;i++){
        weekList.push(startWeek + i);
    }
    return weekList
  }

</script>

<template>
  <div id="calendar-top-banner">
    <div id="title-current-date">{{today}}</div>
    <img class="ibutton" src="../assets/icons/down-arrow-backup-3-svgrepo-com.svg" @click="backward()">
    <img class="ibutton" src="../assets/icons/down-arrow-backup-2-svgrepo-com.svg" @click="forward()">
    <img class="ibutton" src="../assets/icons/gear-svgrepo-com.svg" @click="">
  </div>
  <div class="calendar-day-title">
    <div class="calendar-day-title-tab" v-for="col in colList">{{col}}</div>
  </div>
  <div id="calendar-main">
    <div v-for="week in getRowList(curWeek, 4)" class="calendar-page-row" :week="week">
      <div class="week-tab" :week="week">{{week}}</div>
      <div v-for="date in getDateList(week)" class="calendar-page" :id="dateToStr_yyyymmdd(date)" :class="[isWeekday(date)?'weekday':'weekend']" :dd="date.getDate()" :mm="date.getMonth()+1" :yy="date.getFullYear()" :week="week" :day="date2day(date)" :fulldate="dateToStr_Full(date)"></div>
    </div>
  </div>
</template>

