// App logic.
window.myApp = {};


document.addEventListener('init', function(event) {
    var page = event.target;
    // Each page calls its own initialization controller.
    if (myApp.controllers.hasOwnProperty(page.id)) {
        myApp.controllers[page.id](page);
    }
    if (page.id === "pendingTasksPage") {
        createItem("pending");
    } else if (page.id === "completedTasksPage") {
        createItem("completed");
    } else if (page.id==="currentTaskPage"){
        createItem("current");
    }
});


function createItem(state) {
    Object.keys(localStorage).forEach(function(key){
        let item = JSON.parse(localStorage.getItem(key));
        if (item.state===state) {
            myApp.services.tasks.create(
                {
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    description: item.description,
                    highlight: item.highlight,
                    urgent: item.urgent,
                    state: item.state,
                    jour: item.jour,
                    mois: item.mois,
                    annee: item.annee
                }
            );
        }
    });
}
