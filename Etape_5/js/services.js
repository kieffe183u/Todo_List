/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  /////////////////
  // Task Service //
  /////////////////
  tasks: {

    // Creates a new task and attaches it to the pending task list.
    create: function(data) {
      let checked;
      if (data.state==="completed") {
        checked = "<ons-checkbox checked=\"true\" disabled=\"true\"></ons-checkbox>";
      } else {
        checked = "<ons-checkbox></ons-checkbox>";
      }
      // Task item template.
      var taskItem = ons.createElement(
        '<ons-list-item tappable category="' + data.category+ '">' +
          '<label class="left">' +
           checked+
          '</label>' +
          '<div class="center" data-jour="'+data.jour+'" data-mois="'+data.mois+'" data-annee="'+data.annee+'">' +
            data.title + " : " + data.jour+'/'+data.mois+'/'+data.annee +
          '</div>' +
          '<div class="right">' +
            '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
          '</div>' +
        '</ons-list-item>'
      );
      if (localStorage.getItem(data.id) == null){
        localStorage.setItem(data.id,JSON.stringify(data));
      }
      // Store data within the element.
      taskItem.data = data;

      // Add 'completion' functionality when the checkbox changes.
      taskItem.data.onCheckboxChange = function(event) {
        myApp.services.animators.swipe(taskItem, function() {
          var listId;
          if (taskItem.parentElement.id === 'pending-list' && event.target.checked){
            listId = "#current-list";
            taskItem.data.state = "current";
            event.target.checked = false;
            taskItem.data.checked = false;
            localStorage.removeItem(taskItem.data.id);
            localStorage.setItem(taskItem.data.id,JSON.stringify(data));
            taskItem.data = data;
            document.querySelector(listId).appendChild(taskItem);
          }else if (taskItem.parentElement.id === 'current-list' && event.target.checked){
            event.target.disabled = true;
            listId = "#completed-list";
            taskItem.data.state = "completed";
            event.target.checked = true;
            taskItem.data.checked = true;
            localStorage.removeItem(taskItem.data.id);
            localStorage.setItem(taskItem.data.id,JSON.stringify(data));
            document.querySelector(listId).appendChild(taskItem);
          }
        });
      };

      taskItem.addEventListener('change', taskItem.data.onCheckboxChange);

      // Add button functionality to remove a task.
      taskItem.querySelector('.right').onclick = function() {
        myApp.services.tasks.remove(taskItem);
      };


      // Check if it's necessary to create new categories for this item.
      myApp.services.categories.updateAdd(taskItem.data.category);

      // Add the highlight if necessary.
      if (taskItem.data.highlight) {
        taskItem.classList.add('highlight');
      }

      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      var list = document.querySelector('#' +
          taskItem.data.state+'-list');
      list.insertBefore(taskItem, taskItem.data.urgent ? list.firstChild : null);
      return taskItem;
    },

    // Deletes a task item and its listeners.
    remove: function(taskItem) {
      taskItem.removeEventListener('change', taskItem.data.onCheckboxChange);
      localStorage.removeItem(taskItem.data.id);
      myApp.services.animators.remove(taskItem, function() {
        // Remove the item before updating the categories.
        taskItem.remove();
        // Check if the category has no items and remove it in that case.
        myApp.services.categories.updateRemove(taskItem.data.category);
      });
    },
  },

  /////////////////////
  // Category Service //
  ////////////////////
  categories: {

    // Creates a new category and attaches it to the custom category list.
    create: function(categoryLabel) {
      if (categoryLabel!=="material") {
        var categoryId = categoryLabel;

        // Category item template.
        var categoryItem = ons.createElement(
            '<ons-list-item tappable category-id="' + categoryId + '">' +
            '<div class="left">' +
            '<ons-radio name="categoryGroup" input-id="radio-' + categoryId + '"></ons-radio>' +
            '</div>' +
            '<label class="center" for="radio-' + categoryId + '">' +
            (categoryLabel || 'No category') +
            '</label>' +
            '<div class="right" id="rightCat">' +
            '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
            '</div>' +
            '</ons-list-item>'
        );

        categoryItem.querySelector('#rightCat').onclick = function() {
          myApp.services.categories.remove(categoryItem);
        };


        // Adds filtering functionality to this category item.
        myApp.services.categories.bindOnCheckboxChange(categoryItem);

        // Attach the new category to the corresponding list.
        document.getElementById('custom-category-list').appendChild(categoryItem);
      }
  },

    // On task creation/update, updates the category list adding new categories if needed.
    updateAdd: function(categoryLabel) {
      var categoryItem = document.querySelector('#menuPage ons-list-item[category-id="' + categoryLabel + '"]');

      if (!categoryItem) {
        // If the category doesn't exist already, create it.
        if (categoryLabel !== "material")
         myApp.services.categories.create(categoryLabel);
      }
    },

    // On task deletion/update, updates the category list removing categories without tasks if needed.
    updateRemove: function(categoryLabel) {
      var categoryId = categoryLabel;
      var categoryItem = document.querySelector('#tabbarPage ons-list-item[category="' + categoryId + '"]');

      if (!categoryItem) {
        // If there are no tasks under this category, remove it.
        myApp.services.categories.remove(document.querySelector('#custom-category-list ons-list-item[category-id="' + categoryId + '"]'));
      }
    },

    // Deletes a category item and its listeners.
    remove: function(categoryItem) {
      if (categoryItem) {
        let categorie = categoryItem.getAttribute('category-id');
        // Remove listeners and the item itself.
        Object.keys(localStorage).forEach(function(key){
          if (JSON.parse(localStorage.getItem(key)).category === categorie){
            localStorage.removeItem(key);
          }
        });
        categoryItem.removeEventListener('change', categoryItem.updateCategoryView);
        categoryItem.remove();
        window.location.reload();
      }
    },

    // Adds filtering functionality to a category item.
    bindOnCheckboxChange: function(categoryItem) {
      var categoryId = categoryItem.getAttribute('category-id');
      var allItems = categoryId === null;
      categoryItem.updateCategoryView = function() {
        var taskItems = document.querySelectorAll('#tabbarPage ons-list-item');
        for (var i = 0; i < taskItems.length; i++) {
          taskItems[i].style.display = (allItems || taskItems[i].getAttribute('category') === categoryId) ? '' : 'none';
        }
      };

      categoryItem.addEventListener('change', categoryItem.updateCategoryView);
    },

    // Transforms a category name into a valid id.
    parseId: function(categoryLabel) {
      return categoryLabel ? categoryLabel.replace(/\s\s+/g, ' ').toLowerCase() : '';
    }
  },

  //////////////////////
  // Animation Service //
  /////////////////////
  animators: {

    // Swipe animation for task completion.
    swipe: function(listItem, callback) {
      var animation = 'animation-swipe-right';
      listItem.classList.add('hide-children');
      listItem.classList.add(animation);

      setTimeout(function() {
        listItem.classList.remove(animation);
        listItem.classList.remove('hide-children');
        callback();
      }, 950);
    },

    // Remove animation for task deletion.
    remove: function(listItem, callback) {
      listItem.classList.add('animation-remove');
      listItem.classList.add('hide-children');

      setTimeout(function() {
        callback();
      }, 750);
    }
  },

};
