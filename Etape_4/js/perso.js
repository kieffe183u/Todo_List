function changementTitre(titleElement) {
    document.getElementById("title").innerHTML = titleElement;
}

function changementReturn() {
    document.getElementById("return").innerHTML = document.getElementById("title").nodeValue;
}

function choixSelec(event){
    document.querySelector('#choose-sel').removeAttribute('modifier');
    document.querySelector('#choose-sel').setAttribute('modifier', event.target.value);
}

function choixInit(){
    document.querySelector('#choose-sel').removeAttribute('modifier');
    document.querySelector('#choose-sel').setAttribute('modifier', "");
}

function dateInit(event){
    let elem = document.querySelector("#datepicker");
    elem.datepicker()
}

function isValidDate(year, month, day) {
    var d = new Date(year, month, day);
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day){
        return true;
    }else{
        return false;
    }
}