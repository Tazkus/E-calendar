// 详细版本可以避免解析过程，加快加载速度
// import { createApp } from 'https://unpkg.com/petite-vue?module'
import { createApp } from 'https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js?module'

createApp({
  test: "今晩は",
  chromeVer: window.myapi.chrome(),
}).mount()