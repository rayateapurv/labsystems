let divarray = [];

for (let i = 0; i < 5; i++) {
    let newdiv = document.createElement('div');
    newdiv.classList.add("newdiv");
    document.querySelector('body').appendChild(newdiv); 
    newdiv.setAttribute("id", "no"+i+"");
    newdiv.
    newdiv.innerHTML = "haha";
    divarray.push(newdiv);
}

console.log('HI IM WORKING');

