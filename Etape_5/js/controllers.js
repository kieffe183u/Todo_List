/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

    //////////////////////////
    // Tabbar Page Controller //
    //////////////////////////
    tabbarPage: function (page) {
        // Set button functionality to open/close the menu.
        page.querySelector('[component="button/menu"]').onclick = function () {
            document.querySelector('#mySplitter').left.toggle();
        };
        // Set button functionality to push 'new_task.html' page.
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function (element) {
            element.onclick = function () {
                document.querySelector('#myNavigator').pushPage('html/new_task.html').then(function () {
                    let tab = [];
                    var elems = document.querySelectorAll("#custom-category-list > [category-id]");
                    Array.from(elems).forEach(function (el) {
                        if (!tab.includes(el.getAttribute("category-id"))) {
                            tab.push(el.getAttribute("category-id"));
                        }
                    });
                    var test = document.createElement('option');
                    test.setAttribute('value', "");
                    test.setAttribute('selected', true);
                    document.querySelector('#choose-sel').firstChild.appendChild(test);
                    tab.forEach(function (element) {
                        var elem = document.createElement('option');
                        elem.setAttribute('value', element);
                        elem.innerText = element;
                        document.querySelector('#choose-sel').firstChild.appendChild(elem);
                    });
                })
                ;
            };

            Array.prototype.forEach.call(page.querySelectorAll('[component="button/delete"]'), function (element) {
                element.onclick = function () {
                    ons.notification.confirm(
                        {
                            title: 'Effacer toutes les tâches ?',
                            message: 'Toutes les tâches seront effacées.',
                            buttonLabels: ['Tout Effacer', 'Annuler']
                        }
                    ).then(function (buttonIndex) {
                        if (buttonIndex === 0) {
                            let supp = Array();
                            document.querySelector("#custom-category-list").childNodes.forEach(value => {
                                supp.push(value);
                            });
                            supp.forEach((value =>{
                                value.remove();
                            }));
                            document.querySelector("#completed-list").textContent = "";
                            document.querySelector("#current-list").textContent = "";
                            document.querySelector("#pending-list").textContent = "";
                            Object.keys(localStorage).forEach(function (key) {
                                localStorage.removeItem(key);
                            });
                        }
                    });
                }
            });
            element.show && element.show(); // Fix ons-fab in Safari.
        });


        // Change tabbar animation depending on platform.
        page.querySelector('#myTabbar').setAttribute('animation', ons.platform.isAndroid() ? 'slide' : 'none');
    },

    ////////////////////////
    // Menu Page Controller //
    ////////////////////////
    menuPage: function (page) {
        // Set functionality for 'No Category' and 'All' default categories respectively
        myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item[category-id=""]'));
        myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item:not([category-id])'));

        // Change splitter animation depending on platform.
        document.querySelector('#mySplitter').left.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');
    },
    ////////////////////////////
    // New Task Page Controller //
    ////////////////////////////
    newTaskPage: function (page) {
        // Set button functionality to save a new task.
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function (element) {
            element.onclick = function () {
                if (isNaN(parseInt(page.querySelector("#jour-input").value)) || isNaN(parseInt(page.querySelector("#mois-input").value)) || isNaN(parseInt(page.querySelector("#annee-input").value))) {
                    ons.notification.alert("La date est au mauvais format");
                } else if (isValidDate(parseInt(page.querySelector("#annee-input").value), parseInt(page.querySelector("#mois-input").value), parseInt(page.querySelector("#jour-input").value),) === false) {
                    ons.notification.alert("La date n'est pas valide");
                } else {
                    var newTitle = page.querySelector('#title-input').value;
                    if (newTitle) {
                        // If input title is not empty, create a new task.
                        let categorie;
                        if (page.querySelector('#category-input').value !== "" && page.querySelector('#category-input').value !== null) {
                            categorie = page.querySelector('#category-input').value;
                        } else if (page.querySelector("#choose-sel").getAttribute('modifier') !== "") {
                            if (page.querySelector("#choose-sel").getAttribute('modifier') === "material")
                                categorie = "";
                            else
                                categorie = page.querySelector("#choose-sel").getAttribute('modifier');
                        } else {
                            categorie = "";
                        }
                        choixInit();
                        let plusGrandeKey = 0;
                        if (localStorage.length !== 0) {
                            let plusGrand = -1;
                            Object.keys(localStorage).forEach(function (key) {
                                if (parseInt(key) > plusGrand) {
                                    plusGrand = parseInt(key);
                                }
                            });
                            plusGrandeKey = plusGrand+1;
                        }
                        myApp.services.tasks.create(
                            {
                                id: plusGrandeKey,
                                title: newTitle,
                                category: categorie,
                                description: page.querySelector('#description-input').value,
                                highlight: page.querySelector('#highlight-input').checked,
                                urgent: page.querySelector('#urgent-input').checked,
                                state: "pending",
                                jour: parseInt(page.querySelector("#jour-input").value),
                                mois: parseInt(page.querySelector("#mois-input").value),
                                annee: parseInt(page.querySelector("#annee-input").value)
                            }
                        );
                        // Set selected category to 'All', refresh and pop page.
                        document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
                        document.querySelector('#default-category-list ons-list-item').updateCategoryView();
                        document.querySelector('#myNavigator').popPage();
                    } else {
                        // Show alert if the input title is empty.
                        ons.notification.alert('La tâche a besoin d\'un titre');
                    }
                }
            };
        });
    },
};
