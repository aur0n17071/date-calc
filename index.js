localStorage.setItem('date one - date two', new Date);
localStorage.setItem('date one - date two2', new Date - 1251518121);

let res = document.getElementById("prev-result");
for(let i=0; i<localStorage.length; i++) {
    let key = localStorage.key(i);
    console.log(`${key}: ${localStorage.getItem(key)}`);
    res.innerHTML += "<tr><td>" + key + "</td><td>" + localStorage.getItem(key) + "</td></tr>";
}



