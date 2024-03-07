// 由于壁纸式窗口无法使用回车键，需要创建新的磁贴式窗口，在窗口内进行编辑
function openPage(event){
    let page = event.target;
    let date = page.getAttribute("id");
    let rect = page.getBoundingClientRect();
    const px = 30;
    let bound = {
        x: Math.round(rect.x),
        y: Math.round(rect.y - px),
        width: Math.round(rect.width),
        height: Math.round(rect.height + 2*px)
    };
    console.log(bound);

    let lines = [];
    let children = page.children;
    for(let i=0; i<children.length; i++){
        let child = children[i];
        lines.push(child.textContent);
    }

    // remove all children of page
    page.innerHTML = "";

    window.myapi.openEditing(bound, date, lines);
}

// 根据新窗口活动，同步更新page中的内容
function syncPage(page){

}

// 
function loadPages(diary) {
    // console.log(diary);
    let date = Object.keys(diary);
    // Every found date
    date.forEach(date => {
        let lines = diary[date]; // Array
        let page = document.getElementById(date);
        
        console.log("Loading:"+date+":"+lines);

        lines.forEach(line => {
            // console.log(line);
            if("innerText" in line){
                let l = document.createElement("div");
                l.textContent = line["innerText"];
                page.appendChild(l);
            }
        });
    });
    console.log("All pages updated.");
}



// 为所有page添加事件
function mount(){
    let pages = document.getElementsByClassName("calendar-page");
    for(let i=0; i<pages.length; i++){
        const page = pages[i];
        page.addEventListener("dblclick", openPage);
    }
}

// 自动关联通信API：Side Effect Style
window.myapi.onUpdateCalendar((requested) => {
    loadPages(requested);
});

document.addEventListener('DOMContentLoaded', mount);

export default { openPage };
    