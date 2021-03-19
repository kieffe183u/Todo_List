/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

    //////////////////////////
    // Tabbar Page Controller //
    //////////////////////////
    tabbarPage: function(page) {
        // Set button functionality to open/close the menu.
        page.querySelector('[component="button/menu"]').onclick = function() {
            document.querySelector('#mySplitter').left.toggle();
        };

        // Set button functionality to push 'new_task.html' page.
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
            element.onclick = function() {
                document.querySelector('#myNavigator').pushPage('html/new_task.html');
            };

            element.show && element.show(); // Fix ons-fab in Safari.
        });
    },

    newTaskPage : function (page) {
        Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function (element){
            element.onclick = function () {
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
                    let UpKey = 0;
                    if (localStorage.length !== 0) {
                        let plusGrand = -1;
                        Object.keys(localStorage).forEach(function (key){
                            if (parseInt(key) > plusGrand){
                                plusGrand = parseInt(key);
                            }
                        });
                        UpKey = plusGrand+1;
                    }
                    myApp.services.tasks.create(
                        {
                            id: UpKey,
                            title: newTitle,
                            category: categorie,
                            description: page.querySelector('#description-input').value,
                            highlight: page.querySelector("#highlight-input").checked,
                            urgent: page.querySelector("#urgent-input").checked,

                        }
                    );
                } else {
                    ons.notification.alert('la tâche a besoin d\'un titre');
                }
            };
        });
    }

};
