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



