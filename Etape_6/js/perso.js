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
function triCroi(res) {
    res = res.sort((a, b) => {
        a = a.childNodes.item(2).textContent.split(' ')[0];
        b = b.childNodes.item(2).textContent.split(' ')[0];
        return a.localeCompare(b);
    });
    return res;
}

function triDecroi(res) {
    res = res.sort((a, b) => {
        a = a.childNodes.item(2).textContent.split(' ')[0];
        b = b.childNodes.item(2).textContent.split(' ')[0];
        return b.localeCompare(a);
    });
    return res;
}

function triDate(res) {
    res = res.sort((a, b) => {
        console.log("cc");
        let anneeA = a.childNodes.item(2).dataset.annee;
        let anneeB = b.childNodes.item(2).dataset.annee;
        if (anneeA <= anneeB) {
            return -1;
        } else {
            let moisA = a.childNodes.item(2).dataset.mois;
            let moisB = b.childNodes.item(2).dataset.mois;
            if (moisA <= moisB) {
                return -1;
            } else {
                let jourA = a.childNodes.item(2).dataset.mois;
                let jourB = b.childNodes.item(2).dataset.mois;
                if (jourA <= jourB) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }
    });
    return res;
}

function tri(type) {
    let page = {0:"#pending-list",1:"#current-list",2:"#completed-list"};
    for (let i = 0; i < 3; i++) {
        let res = Array();
        let querySelector = document.querySelector(page[i]);
        querySelector.childNodes.forEach(value => {
            if (value.nodeName !== "#text") {
                res.push(value);
            }
        });
        if (type === "decroi") {
            res = triDecroi(res);
        } else if (type === "croi"){
            res = triCroi(res);
        } else {
            res = triDate(res);
        }
        res.forEach(value => {
            querySelector.appendChild(value);
        });
    }
}