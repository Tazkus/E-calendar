// Legacy

function Notepad(){
    // 指向正被编辑的元素
    this.editing = false;
    // this.edited;
    
    // 为所有page添加事件
    this.mount = ()=>{
        let pages = document.getElementsByClassName("calendar-page");
        for(let i=0; i<pages.length; i++){
            const page = pages[i];
            page.addEventListener("dblclick", this.pageExpand);
        }
    }
    this.pageExpand = (ev)=>{
        const page = ev.target;
        // console.log(page.getAttribute('week'));
        // console.log(page.getAttribute('yy'));
        // console.log(page.getAttribute('mm'));
        // console.log(page.getAttribute('dd'));
        let rect = page.getBoundingClientRect();
        console.log(rect.top, rect.right, rect.bottom, rect.left);

        if(this.editing)
            return;
        else 
            this.editing = true;
    
        let barTop, btnSave, dateTitle;
        let barBtm, btnDone;
        let textField;
        let l0;
    
        let fulldate = page.getAttribute("fulldate");
        // console.log(fulldate);
        
        // 编辑器
        textField = makeTextField();
        // 将 page 的内容移入编辑窗口
        {
            while (page.firstChild) {
                textField.appendChild(page.firstChild);
            }
            // if (textField.childNodes.length == 1){
            if (true){
                // 初始行，防止输入时字体突变
                l0 = document.createElement("div");
                textField.appendChild(l0);
            }
        }
        
        // 标签栏 
        barTop = document.createElement("div");
        barTop.classList.add("barTop", 'ui');
        btnSave = makeBtnSave();
        dateTitle = makeDateTitle(fulldate);
    
        // 工具栏
        barBtm = document.createElement("div");
        barBtm.classList.add("barBtm", 'ui');
        btnDone = document.createElement("button");
        btnDone.classList.add("btnDone");
    
        btnDone.addEventListener("click", playbtnDone);
        btnSave.addEventListener("click", this.saveEdited);
    
        barTop.appendChild(btnSave);
        barTop.appendChild(dateTitle);
        barBtm.appendChild(btnDone);
        
        page.appendChild(textField);
        page.appendChild(barTop);
        page.appendChild(barBtm);

        page.textField = textField;
        page.barTop = barTop;
        page.barBtm = barBtm;
        
        // set caret on textField
        // textField.focus();
        l0.focus();
    

    }

    this.saveEdited = (ev)=>{
        // let b = btnSave.parentNode.parentNode;
        let page = ev.target.parentNode.parentNode;
        let textField = page.textField;
        let barTop = page.barTop;
        let barBtm = page.barBtm;
        
        // 将编辑窗口的内容移回 page
        while (textField.firstChild) {
            // console.log(textField.firstChild.textContent.length);
            if (textField.firstChild.textContent.length > 0)
                page.appendChild(textField.firstChild);
            else
                textField.removeChild(textField.firstChild);
        }
        // 移除编辑组件
        page.removeChild(barTop);
        page.removeChild(barBtm);
        page.removeChild(textField);
        this.editing = false;
    }
}






function playbtnDone(){
    const audio = new Audio('../assets/ding1.mp3');
    audio.play();
};

function makeDateTitle(str){
    let dateTitle = document.createElement("p");
    dateTitle.classList.add("dateTitle");

    // const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    // const day = date.getDate();
    // const formattedDate = `${year}年${month}月${day}日`;
    // dateTitle.textContent = formattedDate;
    dateTitle.textContent = str;

    return dateTitle
}

function makeTextField(){
    let textField = document.createElement("div");
    textField.classList.add("textField",'ui');
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

    return textField;
}

function makeBtnSave(){
    let btnSave = document.createElement("button");
    btnSave.classList.add("btnSave");
    
    return btnSave;
}

export default Notepad;