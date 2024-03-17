// 由于壁纸式窗口无法使用回车键，需要创建新的磁贴式窗口，在窗口内进行编辑

let smart_clicks = false;
// window.addEventListener('blur', () => {
//     console.log('Blurred');
//     smart_clicks = true;
// });
// window.addEventListener('focus', () => {
//     console.log('Focused');
//     smart_clicks = false;
// });

function openPage(event){
    console.log(event.detail);
    if (event.detail < 2) {
        if(smart_clicks){
            smart_clicks = false;
        }
        else{
            smart_clicks = false;
            return;
        }
    }

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
    console.log("Trying to open page: "+date);

    let lines = [];
    let children = page.children;
    for(let i=0; i<children.length; i++){
        let child = children[i];
        lines.push(child.textContent);
    }

    // remove all children of page
    page.innerHTML = "";
    // while(page.firstChild){
    //     page.removeChild(page.firstChild);
    // };

    window.myapi.openEditing(bound, date, lines);
}

// 
function loadPages(diary) {
    let date = Object.keys(diary);
    // Clean every page
    let allPages = document.getElementsByClassName("calendar-page");
    for(let i=0; i<allPages.length; i++){
        let page = allPages[i];
        page.innerHTML = "";
    }

    // Every found date
    date.forEach(date => {
        let lines = diary[date]; // Array
        let page = document.getElementById(date);

        if(page !== null){        
            console.log("Loading:"+date+":"+lines);
    
            lines.forEach(line => {
                if("innerText" in line){
                    let l = document.createElement("div");
                    l.textContent = line["innerText"];
                    page.appendChild(l);
                }
            });
        }
    });
    console.log("All pages updated.");
}

export { openPage, loadPages };
    