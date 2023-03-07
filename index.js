// localStorage.setItem('date one - date two', new Date);
// localStorage.setItem('date one - date two2', new Date - 1251518121);

// let res = document.getElementById("prev-result");
// for(let i=0; i<localStorage.length; i++) {
//     let key = localStorage.key(i);
//     console.log(`${key}: ${localStorage.getItem(key)}`);
//     res.innerHTML += "<tr><td>" + key + "</td><td>" + localStorage.getItem(key) + "</td></tr>";
// }


const inputOne = document.querySelector('.date-input-1');
const inputTwo = document.querySelector('.date-input-2');
const form = document.querySelector('.form');
const preset = document.querySelector('.preset');
const checkButton = document.querySelectorAll('.preset__btn')
const calcType = document.querySelector('.options__type');
const daysType = document.querySelectorAll('.days__btn');
const resultOutput = document.querySelector('.output-result');

document.addEventListener('DOMContentLoaded', tableDraw);
inputOne.addEventListener('focus', disableInput);
inputOne.addEventListener('blur', enableDateInput);
inputTwo.addEventListener('focus', disableInput);
inputTwo.addEventListener('blur', enableDateInput);
preset.addEventListener('change', presetForInput);
form.addEventListener('submit', submitForm);

function tableDraw(){
    let prevResults;
    if (localStorage.getItem('prevResults') !== null){
        prevResults = JSON.parse(localStorage.getItem('prevResults'))
    } else {
        prevResults = [];
    }
    let draw = document.getElementById("prev-result");
    draw.innerHTML = '<tr><td>Початкова дата</td><td>Кiнцева дата</td><td>Результат вимiру</td></tr>';
    prevResults.reverse();
    for (let i = 0; i < prevResults.length; i++){
        let item = prevResults[i];    
        draw.innerHTML += "<tr><td>" + item[0].split('-').reverse().join('-') + "</td><td>" + item[1].split('-').reverse().join('-') + "</td><td>" + item[2] + "</td></tr>";
    }
}

/*приведення дати до потрібного для инпуту формату */
function formatTime(item){
    const date = item.getDate().toString().padStart(2, "0");
    const month = (item.getMonth() + 1).toString().padStart(2, "0");
    const year = item.getFullYear();
    return `${year}-${month}-${date}`
}

function presetForInput(event){
    let week;
    let month;

    /* перевірка на наявність стартового пресету (якщо його немає то кнопки не активні)
    якщо обрати стартовий інпут поклацати на пресети та відалити з нього дату не нажимаючи
    на інший інпут то кнопки будуть теж не активні, поки не оберем знову інпут старту
    */
    if(!inputOne.className.includes('preset_start') && !inputTwo.className.includes('preset_start')){
        for (let btn of checkButton){
            btn.firstChild.nextSibling.checked = false;
        }
    }
    /* якщо інпут-1 пустий а в нього є стартовий клас то видаляєм клас та знімаємо активне значення
    з чекбоксів
    */
    if (inputOne.value === '' && inputOne.className.includes('preset_start')){
        inputOne.classList.remove('preset_start');
        for (let btn of checkButton){
            btn.firstChild.nextSibling.checked = false;
        }
    }
    /* якщо інпут-2 пустий а в нього є стартовий клас то видаляєм клас та знімаємо активне значення
    з чекбоксів
    */
    if (inputTwo.value === '' && inputTwo.className.includes('preset_start')){
        inputTwo.classList.remove('preset_start');
        for (let btn of checkButton){
            btn.firstChild.nextSibling.checked = false;
        }
    }
    /*зчитуємо дату з першого інпуту якщо він не порожній та має стартовий клас
     та вставляємо в другий згідно обраного пресету
    */
    if (inputOne.value !== '' && inputOne.className.includes('preset_start')){
        if (event.target.id === 'preset-1'){
            let week = new Date(inputOne.value);
            week.setDate((week.getDate() + 7));
            inputTwo.value = formatTime(week);
        }
        if (event.target.id === 'preset-2'){
            let month = new Date(inputOne.value);
            month.setMonth((month.getMonth() + 1));
            inputTwo.value = formatTime(month);
        }
    }
    /*зчитуємо дату з другого інпуту якщо він не порожній та має стартовий клас
     та вставляємо в другий згідно обраного пресету
    */
    if(inputTwo.value !== '' && inputTwo.className.includes('preset_start')){
        if (event.target.id === 'preset-1'){
            let week = new Date(inputTwo.value);
            week.setDate((week.getDate() - 7));
            inputOne.value = formatTime(week);
        }
        if (event.target.id === 'preset-2'){
            let month = new Date(inputTwo.value);
            month.setMonth((month.getMonth() - 1));
            inputOne.value = formatTime(month);
        } 
    }
}

function disableInput(event){
    // let value = event.target.value;
    if (event.target.className.includes('date-input-1')){
        inputTwo.disabled = true;
        event.target.classList.add('preset_start');
        inputTwo.classList.remove('preset_start');
    }
    if (event.target.className.includes('date-input-2')){
        inputOne.disabled = true;
        event.target.classList.add('preset_start');
        inputOne.classList.remove('preset_start');
    }
}

function enableDateInput(){
    if (inputOne.value){
        inputTwo.disabled = false;
        inputTwo.min = inputOne.value;
    } else {
        inputTwo.min = '';
        inputTwo.disabled = false;
    }
    if (inputTwo.value){
        inputOne.disabled = false;
        inputOne.max = inputTwo.value;
    } else {
        inputOne.max = '';
        inputOne.disabled = false;
    }
}

// 
// 



function submitForm(event){
    event.preventDefault();
    let startValue =new Date( inputOne.value);
    let endValue =new Date( inputTwo.value);
    let dayType;
    //перевіряю стан радио щодо типу днів що потрібно рахувати
    for (let item of daysType){
        if (item.firstElementChild.checked){
            dayType = item.firstElementChild.value;
        }
    }
    //лічильник днів та перевірка кожного дня з початкової дати до кінцевої
    let daysCount = 0;
    const curDate = new Date(startValue.getTime());
    curDate.setHours(23,59,59,999);
    while (curDate < endValue) {
        if(curDate === endValue) return daysCount;
        const dayOfWeek = curDate.getDay();
        if (dayType === 'all'){
            daysCount++;
            curDate.setDate(curDate.getDate() + 1);
        }
        if (dayType === 'weekdays'){
            if(dayOfWeek !== 0 && dayOfWeek !== 6)
            daysCount++;
            curDate.setDate(curDate.getDate() + 1);
        }
        if (dayType === 'weekend'){
            if(dayOfWeek === 0 || dayOfWeek === 6)
            daysCount++;
            curDate.setDate(curDate.getDate() + 1);
        }
    }

    let result = durationBetweenDates(daysCount, calcType.value);
    if (daysCount === 0 ){
        return null;
    }

    let prevResults;
    if (localStorage.getItem('prevResults') !== null){
        prevResults = JSON.parse(localStorage.getItem('prevResults'))
    } else {
        prevResults = [];
    }
    if (prevResults.length === 10){
        prevResults.shift();
    }
    prevResults.push([inputOne.value, inputTwo.value, result])
    localStorage.setItem('prevResults',JSON.stringify(prevResults));
    resultOutput.textContent = result;
    tableDraw();
}

function durationBetweenDates(daysCount, formatType){
    let daysArr = ['день','днi','днiв'];
    let hoursArr = ['година','години','годин'];
    switch (formatType){
        case 'seconds':
        return `${daysCount * 1440 * 60} секунд`;
        break; 
        case 'minutes':
        return `${daysCount * 24 * 60} хвилин`;
        break; 
        case 'hours':
        daysCount = daysCount * 24;
        return`${daysCount} ${(hoursArr[(daysCount=(daysCount=daysCount%100)>19?(daysCount%10):daysCount)==1?0 : ((daysCount>1&&daysCount<=4)?1:2)])}`;
        break; 
        case 'days':
        return `${daysCount} ${(daysArr[(daysCount=(daysCount=daysCount%100)>19?(daysCount%10):daysCount)==1?0 : ((daysCount>1&&daysCount<=4)?1:2)])}`;
        break;
        default:
        return `${daysCount} мiлiсекунд`;
        break;
    }
}
