import {setCaret} from './modules/caret.js'

let textArea = document.getElementById('textArea');
textArea.contentEditable = true;
textArea.spellcheck = false;

function get_lines(){
    let lines = [];
    let divs = textArea.querySelectorAll("div");
    for(let i = 0; i < divs.length; i++){
        if(divs[i].innerText.length > 0){
            lines.push({
                "innerText":divs[i].innerText,
                "color":divs[i].style.color,
                "--done":divs[i].getAttribute('done'),
            });
        }
    }
    return lines;
}

let this_date = "20240101";
let this_lines;

window.myapi.onReceivePage((date, lines) => {
    this_date = date;
    this_lines = lines;
    console.log(date);
    console.log(this_lines);

    let fulldate = `${date.slice(0,4)}年${date.slice(4,6)}月${date.slice(6,8)}日`;
    $("#dateTitle").text(fulldate);
    // document.getElementById("dateTitle").innerText = fulldate;
    
    let textArea = document.getElementById("textArea");
    textArea.innerHTML = "";
    // if (lines.length == 0 && textArea.children.length == 0) {
    //     textArea.innerHTML = "<div></div>";
    // }

    // load content buffer
    for(let i = 0; i < this_lines.length; i++){
        let div = document.createElement("div");
        div.innerText = this_lines[i];
        textArea.appendChild(div);
    }
});

$(document).ready(()=>{



    // set caret to last line last char
    const div = document.querySelector("#textArea>div:last-child");
    setCaret(div.innerText.length, div);

    // Bind button events
    $('#btnSave').on('mouseup.left', (el)=>{
        window.myapi.saveEditing(this_date, get_lines());
        // window.myapi.closeEditor();
        window.close();
    })

    // 在textArea的所有子元素div被backspace删除后，模拟用户输入了回车
    textArea.addEventListener("keyup", (e) => {
        if(true){
            let divs = textArea.querySelectorAll("div");
            if(divs.length == 0){
                // e.preventDefault();
                // e.stopPropagation();
                textArea.innerHTML = "<div></div>";
            }
        }
    });
})
