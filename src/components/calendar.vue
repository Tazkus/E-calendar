<!-- (组合式API) SFC形式不需要手动暴露状态和方法 -->
<!-- <script setup>中的顶层的导入、声明的变量和函数可在同一组件的模板中直接使用。 -->
<script setup>
  import { ref } from 'vue';
  
  // 静态方法
  function date2day(day) {
    let day = date.getDay();
    if (!this.sun_first) day = (day+6) % 7;
    return day;
  }
  
  // 
  const mspd = 8.64e7; // milliseconds in 24h
  const firstDate = new Date(2024, 0, 1);
  const firstDay = date2day(firstDate);
  const zeroDate = new Date(firstDate - mmm * firstDay);

  // 状态
  let curWeek = ref(0);
  
  // 状态更新方法（无返回）
  function scrollup() { 
    curWeek.value--;
  }
  function scrolldown() {
    curWeek.value++;
  }
  function updateCurWEeek() {
    let date = new Date();
    let week = (date - zeroDate) / mmm / 7;
    curWeek = week;
  }

  // 返回数据的方法
  function isWeekday() {
    let day = (date.getDay()+6)%7;
    return day<5;
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





<!--  -->
<template id="CalendarView">

  <div class="calendar-top-banner">
    <div id="title-current-date">{{today}}</div>
    <image class="ibutton" src="../assets/icons/down-arrow-backup-3-svgrepo-com.svg"  @click="calendar.scrollup()">
    <image class="ibutton" src="../assets/icons/down-arrow-backup-2-svgrepo-com.svg" @click="calendar.scrolldown()">
    <image class="ibutton" src="../assets/icons/gear-svgrepo-com.svg" @click="openSettings">
  </div>
  <div class="calendar-day-title">
    <div class="calendar-day-title-tab" v-for="col in colList">{{col}}</div>
  </div>

  <div v-for="week in calendar.getRowList(calendar.curWeek, 4)" class="calendar-page-row" :week="week">
    <!-- <div class="calendar-week-no" :week="week">{{week}}</div> -->
    <div v-for="date in calendar.getDateList(week)" class="calendar-page" :class="[isWeekday(date)?'weekday':'weekend']"
    :dd="date.getDate()" :datestr="calendar.date2str(date)" :week="week">
    </div>
  </div>
  
</template>

