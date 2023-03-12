"use strict"

const inputOne = document.querySelector('.date-input-1');
const inputTwo = document.querySelector('.date-input-2');
const form = document.querySelector('.form');
const preset = document.querySelector('.preset');
const checkButton = document.querySelectorAll('.preset__btn')
const calcType = document.querySelector('.options__type');
const daysType = document.querySelectorAll('.days__btn');
const resultOutput = document.querySelector('.output-result');
const presetIdOne = document.getElementById('preset-1');
const presetIdTwo = document.getElementById('preset-2');
const themeBtn = document.querySelector('.theme-btn');
const clearBtn = document.querySelector('.prev-result__clear-btn');
const theme = document.querySelector('.theme');

document.addEventListener('DOMContentLoaded', tableDraw);
inputOne.addEventListener('focus', disableInput);
inputOne.addEventListener('blur', enableDateInput);
inputTwo.addEventListener('focus', disableInput);
inputTwo.addEventListener('blur', enableDateInput);
preset.addEventListener('change', presetForInput);
form.addEventListener('submit', submitForm);
themeBtn.addEventListener('click', themeChange);
clearBtn.addEventListener('click', clearTable)

//відображення теми яка була вибрана раніше
if (localStorage.getItem('theme') === 'black'){
    theme.classList.toggle('body-black');
    themeBtn.textContent = 'Світла тема';
}
//функція робить талицю в HTML з даних які є у локал сторедж
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
        draw.innerHTML += "<tr><td>" + item[0].split('-').reverse().join('-') + "</td><td>" + item[1].split('-').reverse().join('-') + "</td><td>" + item[2] + ` (${item[3]})` + "</td></tr>";
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
    /*Блок призначений для встановлення дат якщо інпути пусті а пресет натиснули */
    if((!inputOne.className.includes('preset_start') && !inputTwo.className.includes('preset_start')) && (inputOne.value === '' && inputTwo.value === '')){
        let defaultPreset = new Date();
        inputOne.value = formatTime(defaultPreset);
        inputOne.classList.add('preset_start');
        if (event.target.id === 'preset-1'){
            defaultPreset.setDate((defaultPreset.getDate() + 7));
            inputTwo.value = formatTime(defaultPreset);
        }
        if (event.target.id === 'preset-2'){
            defaultPreset.setMonth((defaultPreset.getMonth() + 1));
            inputTwo.value = formatTime(defaultPreset);
        }
        enableDateInput();
    }

    /*зчитуємо дату з першого інпуту якщо він не порожній та має стартовий клас
     та вставляємо в другий згідно обраного пресету */
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
        enableDateInput();
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
        enableDateInput();
    }
}

/* Блок для вимкнення активного стану з інпутів під час вводу дати */
function disableInput(event){
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

/* Блок для вмикання інпутів та встановлення мінімальної та максимальної дати
згідно з значеннями інпутів */
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
        /* перевірка на наявність стартового пресету (якщо його немає то кнопки не активні)
    якщо обрати стартовий інпут поклацати на пресети та відалити з нього дату не нажимаючи
    на інший інпут то кнопки будуть теж не активні, поки не оберем знову інпут старту
    */

    /* якщо інпут-1 пустий (ми його почистили) а в нього є стартовий клас то видаляєм клас 
    та знімаємо активне значення з чекбоксів */
    if (inputOne.value === '' && inputOne.className.includes('preset_start')){
        inputOne.classList.remove('preset_start');
        for (let btn of checkButton){
            btn.firstChild.nextSibling.checked = false;
        }
    }
    /* якщо інпут-2 пустий (ми його почистили) а в нього є стартовий клас то видаляєм клас 
    та знімаємо активне значення з чекбоксів */
    if (inputTwo.value === '' && inputTwo.className.includes('preset_start')){
        inputTwo.classList.remove('preset_start');
        for (let btn of checkButton){
            btn.firstChild.nextSibling.checked = false;
        }
    }
    /* вимкнення кнопок пресетів якщо немає активного стану у інпутів (
        випадок коли ми обрали дати та пресети а потім з одного з інпутів витерли значення а на другий
        не клацнули (тобто немає стартового інпуту)) */
    if ((inputOne.value === '' || inputTwo.value === '') && (!inputOne.className.includes('preset_start') && !inputTwo.className.includes('preset_start'))){
        for (let btn of checkButton){
            btn.firstChild.nextSibling.disabled = true;
        }
    } else {
        for (let btn of checkButton){
            btn.firstChild.nextSibling.disabled = false;
        }
    }
    /* Механізм перерахунку дати згідно обраного пресету якщо дату вводять з клавіатури*/
    if ((inputOne.value !== '' && inputOne.className.includes('preset_start')) && inputOne.value < inputTwo.value){
        if (presetIdOne.checked === true){
            let week = new Date(inputOne.value);
            week.setDate((week.getDate() + 7));
            inputTwo.value = formatTime(week);
        }
        if (presetIdTwo.checked === true){
            let month = new Date(inputOne.value);
            month.setMonth((month.getMonth() + 1));
            inputTwo.value = formatTime(month);
        }
    }
    /* Механізм перерахунку дати згідно обраного пресету якщо дату вводять з клавіатури*/
    if ((inputTwo.value !== '' && inputTwo.className.includes('preset_start')) && inputOne.value < inputTwo.value){
        if (presetIdOne.checked === true){
            let week = new Date(inputTwo.value);
            week.setDate((week.getDate() - 7));
            inputOne.value = formatTime(week);
        }
        if (presetIdTwo.checked === true){
            let month = new Date(inputTwo.value);
            month.setMonth((month.getMonth() - 1));
            inputOne.value = formatTime(month);
        }
    }

    /* блок призначений для ситуацій коли значення інпуту введене
    з клавіатури більше ніж максимум або мінімум 
    (без нього форма не спрацює та видасть помилку але значення в інпуті
    залишається) але він чистить лише перший інпут у всіх випадках*/
    // if(inputOne.value !== '' && (inputTwo.value < inputOne.value)){
    //     inputTwo.value = '';
    // }
    // if(inputTwo.value !== '' && (inputOne.value > inputTwo.value)){
    //     inputOne.value = '';
    // }
}

// 
// 
function submitForm(event){
    event.preventDefault();
    let startValue =new Date( inputOne.value);
    let endValue =new Date( inputTwo.value);
    let dayType;
    let dayTypeText;
    //перевіряю стан радио щодо типу днів що потрібно рахувати
    for (let item of daysType){
        if (item.firstElementChild.checked){
            dayType = item.firstElementChild.value;
            dayTypeText = item.firstElementChild.nextElementSibling.textContent[0].toLocaleLowerCase() + item.firstElementChild.nextElementSibling.textContent.slice(1);
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
    // робимо обічислення
    let result = durationBetweenDates(daysCount, calcType.value);
    // якщо результат обчислення 0 то нічого не робимо
    if (daysCount === 0 ){
        return null;
    }
    // беремо масив з локал сторедж та записуємо в нього данні для обчислення з результатом
    let prevResults;
    if (localStorage.getItem('prevResults') !== null){
        prevResults = JSON.parse(localStorage.getItem('prevResults'))
    } else {
        prevResults = [];
    }
    // якщо в масиві вже 10 значешь то видаляємо перше
    if (prevResults.length === 10){
        prevResults.shift();
    }
    /*  перевірка останнього обчислення щоб воно не дублювалось якщо натискати на кнопку 
    декілька разів без зміни даних в інпутах*/
    if (JSON.stringify(prevResults[prevResults.length - 1]) === JSON.stringify([inputOne.value, inputTwo.value, result, dayTypeText])){
        resultOutput.textContent = result;
        return null;
    }

    /* якщо все ок то записуємо данні в локал сторедж та відображаємо результат з
    затримкою в 300мс для кращого сприйняття для користувача */
    prevResults.push([inputOne.value, inputTwo.value, result, dayTypeText])
    localStorage.setItem('prevResults',JSON.stringify(prevResults));
    console.log(dayTypeText);
    setTimeout(()=>{
        resultOutput.textContent = result;
        tableDraw();}, 300);
}
/*Прорахунок разниці між днями та додавання тексту для типу обчислення */
function durationBetweenDates(daysCount, formatType){
    // массиви пресетів слів для кількості днів
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

function themeChange(){
    theme.classList.toggle('body-black');
    if (theme.className.includes('body-black')){
        localStorage.setItem('theme', 'black');
        themeBtn.textContent = 'Світла тема';
    } else {
        localStorage.setItem('theme', 'white');
        themeBtn.textContent = 'Темна тема';
    }
}
function clearTable(){
    if(confirm('Ви впевнені що хочете очистити історію?')){
        localStorage.removeItem('prevResults');
        tableDraw();
    }
}