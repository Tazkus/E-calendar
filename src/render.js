// Renderer (Main World)
document.addEventListener('DOMContentLoaded', main);

let editing = false;

function main(){
    const blocks = document.getElementsByClassName("block");
    for(let i=0; i<blocks.length; i++){
        const block = blocks[i];
        block.addEventListener("dblclick", expand);
    }
}



function expand(){
    let topbar, save, dateTitle;
    let btmbar, done;
    let textField;

    if(editing)
        return;
    else 
        editing = true;
    // 标签栏 
    topbar = document.createElement("div");
    topbar.classList.add("topbar");
    save = document.createElement("button");
    save.classList.add("save");
    dateTitle = document.createElement("p");
    dateTitle.classList.add("dateTitle");
    {
        const date = new Date(2023, 7, 14); // 月份从0开始，所以7表示8月
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formattedDate = `${year}年${month}月${day}日`;
        dateTitle.textContent = formattedDate;
    }
    // 工具栏
    btmbar = document.createElement("div");
    btmbar.classList.add("btmbar");
    done = document.createElement("button");
    done.classList.add("done");
    // 编辑器
    l0 = document.createElement("div");
    textField = document.createElement("div");
    textField.classList.add("textField");
    textField.classList.add("editor");
    textField.contentEditable = true;
    textField.spellcheck = false;
    // 在textField的所有子元素div被backspace删除后，模拟用户输入了回车
    textField.addEventListener("keyup", (e)=>{
        if(true){
            let divs = textField.querySelectorAll("div");
            if(divs.length == 0){
                // e.preventDefault();
                // e.stopPropagation();
                textField.innerHTML = "<div></div>";
            }
        }
    });

    

    save.addEventListener("click", ()=>{
        let b = save.parentNode.parentNode;
        b.removeChild(topbar);
        b.removeChild(btmbar);
        b.removeChild(textField);
        editing = false;
    });
    done.addEventListener("click", ()=>{
        playDone();
    });
    
    topbar.appendChild(save);
    topbar.appendChild(dateTitle);
    btmbar.appendChild(done);
    textField.appendChild(l0);
    this.appendChild(textField);
    this.appendChild(topbar);
    this.appendChild(btmbar);

    // set caret on textField
    textField.focus()

    if(false){
        //在网页关闭前保存
        window.addEventListener("beforeunload", (e)=>{
            //保存textField的内容至本地
            localStorage.setItem("textField", textField.innerHTML);
        });
    }
}

function playDone(){
    const audio = new Audio('../ding1.mp3');
    audio.play();
};

const caret = el => {
    const range = window.getSelection().getRangeAt(0);
    const prefix = range.cloneRange();
    prefix.selectNodeContents(el);
    prefix.setEnd(range.endContainer, range.endOffset);
    return prefix.toString().length;
};

const setCaret = (pos, parent) => {
    for (const node of parent.childNodes) {
        if (node.nodeType == Node.TEXT_NODE) {
            if (node.length >= pos) {
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(node, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1;
            } else {
                pos = pos - node.length;
            }
        } else {
            pos = setCaret(pos, node);
            if (pos < 0) {
                return pos;
            }
        }
    }
    return pos;
};