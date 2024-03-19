// 根据宽高比添加将渐变角度设置为css自定义属性
function setGradientDeg(selector){
    let element, elements;
    if(selector.charAt(0) === '.'){
        elements = document.getElementsByClassName(selector.slice(1));
        for(let i=0; i<elements.length; i++){
            element = elements[i];
            _setGradientDeg(element);
        }
    };
    if(selector.charAt(0) === '#'){
        element = document.getElementById(selector.slice(1));
        _setGradientDeg(element);
    };
}
function _setGradientDeg(element){
    let whratio = element.offsetWidth / element.offsetHeight;
    let deg = -Math.atan(whratio) / Math.PI * 180;
    let style =     
    `linear-gradient(
        ${deg}deg,
        hsl(000deg, 0%, 79%, 0.10) 0%,
        hsl(344deg, 0%, 81%, 0.10) 21%,
        hsl(344deg, 0%, 83%, 0.10) 30%,
        hsl(344deg, 0%, 86%, 0.10) 39%,
        hsl(344deg, 0%, 88%, 0.10) 46%,
        hsl(344deg, 0%, 90%, 0.10) 54%,
        hsl(344deg, 0%, 93%, 0.10) 61%,
        hsl(344deg, 0%, 95%, 0.10) 69%,
        hsl(344deg, 0%, 98%, 0.10) 79%,
        hsl(000deg, 0%, 100%, 0.10) 100%)`;
    // element.setAttribute('gradient-deg', deg);
    element.style.setProperty('background-image', style); 
}

export {setGradientDeg};