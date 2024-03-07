import { remote } from "electron";

console.log('size:', remote.getCurrentWindow().getSize());
// size: [1000, 700]

console.log('bounds:', remote.getCurrentWindow().getBounds());
// bounds: {height: 700, width: 1000, x: 226, y: 97}