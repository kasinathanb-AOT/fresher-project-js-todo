document.addEventListener("DOMContentLoaded", function () {
  let todoList = JSON.parse(localStorage.getItem("TODO-LIST")) || [];
  renderTasks(todoList);
  let sortMenu = document.getElementById("sortMenu");
  sortMenu.textContent = "Oldest";

  // Open the modal for adding new task
  document
    .getElementById("open-add-modal")
    .addEventListener("click", function () {
      document.getElementById("exampleModalLabel").textContent = "Add Task";
      document.getElementById("title").value = "";
      document.getElementById("desc").value = "";
      document.getElementById("date").value = "";
      document.getElementById("task-id").value = "";

      // Reset the button text to "Add Task"
      let btnText = document.getElementById("btn-text");
      btnText.innerHTML = "Add Task";
    });

  // Sort by newest first based on task id
  document.getElementById("new").addEventListener("click", function () {
    sortMenu.textContent = "Newest";
    todoList.sort((a, b) => b.id - a.id);
    renderTasks(todoList);
  });

  // Sort by oldest first based on task id
  document.getElementById("old").addEventListener("click", function () {
    todoList.sort((a, b) => a.id - b.id);
    sortMenu.textContent = "Oldest";
    renderTasks(todoList);
  });

  // Save or update task
  document.getElementById("save-task").addEventListener("click", function () {
    let id = document.getElementById("task-id").value;
    let title = document.getElementById("title").value.trim();
    let description = document.getElementById("desc").value.trim();
    let dueDate = document.getElementById("date").value.trim();

    if (title === "") {
      alert("Please enter a TITLE for the task.");
    } else if (description === "") {
      alert("Please enter a DESCRIPTION for the task.");
    } else if (dueDate === "") {
      alert("Please enter a DUE DATE for the task.");
    } else {
      if (id) {
        // Edit existing task
        todoList = todoList.map((task) => {
          if (task.id === Number(id)) {
            return { ...task, title, description, dueDate };
          }
          return task;
        });
      } else {
        // Add new task
        let newTask = {
          id: Date.now(),
          title: title,
          description: description,
          dueDate: dueDate,
          completed: false,
        };
        todoList.push(newTask);
      }

      localStorage.setItem("TODO-LIST", JSON.stringify(todoList));
      $("#task-modal").modal("hide");
      renderTasks(todoList);
    }
  });

  // Search tasks by title
  document
    .getElementById("search-input")
    .addEventListener("input", function () {
      let query = this.value.trim().toLowerCase();
      let filteredTasks = todoList.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
      renderTasks(filteredTasks);
    });

  // Function to render tasks
  function renderTasks(tasks) {
    let activeTasksContainer = document.getElementById("active-tasks");
    let completedTasksContainer = document.getElementById("completed-tasks");

    // Clear existing content
    activeTasksContainer.innerHTML = "";
    completedTasksContainer.innerHTML = "";

    // Add heading and clear button container for Completed Tasks
    let completedTasksHeader = document.createElement("div");
    completedTasksHeader.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mb-3",
      "flex-wrap",
      "top-ctn"
    );

    // Heading for Completed Tasks
    let completedTasksHeading = document.createElement("h5");
    completedTasksHeading.textContent = "Completed Tasks";

    // Clear button for Completed Tasks
    let clearButton = document.createElement("button");
    clearButton.textContent = "Clear Completed Tasks";
    clearButton.classList.add(
      "btn",
      "btn-light",
      "border-1",
      "border-primary",
      "text-primary",
      "ml-3"
    );

    clearButton.addEventListener("click", function () {
      todoList = todoList.filter((task) => !task.completed);
      localStorage.setItem("TODO-LIST", JSON.stringify(todoList));
      renderTasks(todoList);
    });

    completedTasksHeader.appendChild(completedTasksHeading);
    completedTasksHeader.appendChild(clearButton);
    completedTasksContainer.appendChild(completedTasksHeader);

    // Iterate over tasks and render each task
    tasks.forEach((task) => {
      let taskItem = document.createElement("div");
      taskItem.classList.add("task-item", "border", "p-3", "mb-1", "rounded");
      taskItem.id = task.id;

      let flexContainer = document.createElement("div");
      flexContainer.classList.add(
        "d-flex",
        "justify-content-between",
        "div-gap"
      );

      let radioAndTitle = document.createElement("div");
      radioAndTitle.classList.add("d-flex", "align-items-center", "task-left");

      let radioInput = document.createElement("input");
      radioInput.classList.add("checkbox-style");
      radioInput.type = "checkbox";
      radioInput.checked = task.completed;
      radioInput.addEventListener("change", function () {
        task.completed = radioInput.checked;
        localStorage.setItem("TODO-LIST", JSON.stringify(todoList));
        renderTasks(todoList);
      });

      let title = document.createElement("h6");
      title.textContent = task.title;

      let badge = document.createElement("span");

      badge.classList.add(
        "customSpan",
        task.completed ? "badge-success" : "badge-warning",
        "ml-2"
      );

      radioAndTitle.appendChild(radioInput);
      radioAndTitle.appendChild(title);
      radioAndTitle.appendChild(badge);

      let buttonsContainer = document.createElement("div");
      buttonsContainer.classList.add("button-ctn");

      let editButton = document.createElement("button");
      editButton.classList.add("btn", "btn-link", "p-0");
      editButton.innerHTML = `<img src="./images/edit.svg" alt="Edit" width="18" height="18">`;
      editButton.setAttribute("data-toggle", "modal");
      editButton.setAttribute("data-target", "#task-modal");
      editButton.addEventListener("click", function () {
        document.getElementById("exampleModalLabel").textContent = "Edit Task";
        document.getElementById("task-id").value = task.id;
        document.getElementById("title").value = task.title;
        document.getElementById("desc").value = task.description;
        document.getElementById("date").value = task.dueDate;
        let btnText = document.getElementById("btn-text");
        btnText.innerHTML = "Update";
      });

      let deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-link", "p-0", "padding-btn");
      deleteButton.innerHTML = `<img src="./images/delete.svg" alt="Delete" width="18" height="18">`;

      deleteButton.addEventListener("click", function () {
        // Open the confirmation modal
        $("#confirmationModal").modal("show");
        // Handle delete confirmation
        document
          .getElementById("confirmDeleteButton")
          .addEventListener("click", function () {
            // Deleting the selected task
            todoList = todoList.filter((t) => t.id !== task.id);
            localStorage.setItem("TODO-LIST", JSON.stringify(todoList));
            renderTasks(todoList);
            // Close the modal after deletion
            $("#confirmationModal").modal("hide");
          });
      });

      buttonsContainer.appendChild(editButton);
      buttonsContainer.appendChild(deleteButton);

      flexContainer.appendChild(radioAndTitle);
      flexContainer.appendChild(buttonsContainer);

      let taskItemSub = document.createElement("div");
      taskItemSub.classList.add("taskItemSub");

      let description = document.createElement("p");
      description.textContent = task.description;

      let dateParagraph = document.createElement("p");
      dateParagraph.classList.add("text-muted");
      let dateText = document.createElement("small");
      dateText.innerHTML = `
    <img src="./images/calender.svg" width="24px" height="24px"/>
      ${new Date(task.dueDate).toLocaleDateString()}`;

      dateParagraph.appendChild(dateText);
      taskItemSub.appendChild(description);
      taskItemSub.appendChild(dateParagraph);

      taskItem.appendChild(flexContainer);
      taskItem.appendChild(taskItemSub);

      if (task.completed) {
        completedTasksContainer.appendChild(taskItem);
      } else {
        activeTasksContainer.appendChild(taskItem);
      }
    });
  }
});
