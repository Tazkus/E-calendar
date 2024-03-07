

async function a2(){
    return 'a2';
}

async function b(){
    return 'b';
}

function a(){
    console.log('a1');
    a2().then(res=>console.log(res));
    console.log('a3');
}

b().then(res=>console.log(res));
console.log(1);
a();
console.log(2);
