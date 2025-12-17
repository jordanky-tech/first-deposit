
  //  CLASSE TASK

class Task {
  constructor(
    id,
    text,
    priority = "Moyenne",
    completed = false,
    createdAt = new Date(),
    description = ""
  ) {
    this.id = id;
    this.text = text;
    this.priority = priority;
    this.completed = completed;
    this.createdAt = createdAt;
    this.description = description;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }
}


  //  CLASSE TODOLIST

class TodoApp {
  constructor() {
    // Propriétés
    this.tasks = [];
    this.currentFilter = "Toutes";
    this.searchQuery = "";
    this.currentPage = 1;
    this.tasksPerPage = 5;
    this.nextId = 1;
    this.editingTaskId = null;
    this.darkMode = false;

    // Initialisation
    this.initializeElements();
    this.loadTasks();
    this.loadDarkModePreference();
    this.setupEventListeners();
    this.renderTasks();
  }


        // INITIALISATION DES ELEMENTS DOM
  
  initializeElements() {
    this.input = document.querySelector(".top input");
    this.prioritySelect = document.getElementById("priorite");
    this.addBtn = document.querySelector(".top button");
    this.taskList = document.getElementById("task-list");
    this.emptyBox = document.getElementById("empty");
    this.searchInput = document.querySelector(".search input");
    this.filtreBtns = document.querySelectorAll(".filtre div");
    this.totalSpan = document.querySelectorAll(
      ".comptage p span:first-child"
    )[0];
    this.doneSpan = document.querySelectorAll(
      ".comptage p span:first-child"
    )[1];
    this.pendingSpan = document.querySelectorAll(
      ".comptage p span:first-child"
    )[2];
    this.modeBtn = document.querySelector(".change-mode");
    this.moonIcon = document.querySelector(".fa-moon");
    this.sunIcon = document.querySelector(".fa-sun");
    this.notificationContainer = document.getElementById(
      "notification-container"
    );
  }


        // EVENEMENTS

  setupEventListeners() {
    // Ajout de tâche
    this.addBtn.addEventListener("click", () => this.addTask());

    this.taskList.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      if (e.target.classList.contains("delete")) this.deleteTask(id);
      if (e.target.classList.contains("edit")) this.openEditTask(id);
      if (e.target.tagName === "INPUT" && e.target.type === "checkbox")
        this.toggleComplete(id);
    });

    // Recherche
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value;
      this.currentPage = 1;
      this.renderTasks();
    });

    // Filtrage
    this.filtreBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentFilter = btn.textContent;
        this.currentPage = 1;
        this.filtreBtns.forEach((b) => {
          b.style.background = "var(--bg-secondary)";
          b.style.color = "var(--text-primary)";
        });
        btn.style.background = "var(--primary)";
        btn.style.color = "white";
        this.renderTasks();
      });
    });


    // Dark mode
    this.modeBtn.addEventListener("click", () => this.toggleDarkMode());
  }


        // AJOUTER TACHE

  addTask() {
    const text = this.input.value.trim();
    const priority = this.prioritySelect.value;

    if (!text)
      return this.showNotification("Veuillez entrer une tâche", "warning");

    const task = new Task(this.nextId++, text, priority);
    this.tasks.push(task);

    this.input.value = "";
    this.saveTasks();
    this.showNotification("Tâche ajoutée avec succès", "success");
    this.renderTasks();
  }

        // SUPPRIMER TACHE

  deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.saveTasks();
    this.showNotification("Tâche supprimée", "error");
    this.renderTasks();
  }


        // EDITER TACHE

  openEditTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    const newText = prompt("Modifier la tâche :", task.text);
    if (newText) {
      task.text = newText.trim();
      this.saveTasks();
      this.showNotification("Tâche mise à jour", "info");
      this.renderTasks();
    }
  }


        // TOGGLE COMPLETION
  
  toggleComplete(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.toggleCompleted();
      this.saveTasks();
      this.showNotification("Statut de la tâche mis à jour", "info");
      this.renderTasks();
    }
  }


        // FILTRAGE + RECHERCHE

  getFilteredTasks() {
    return this.tasks
      .filter((task) => {
        if (this.currentFilter === "En attente" && task.completed) return false;
        if (this.currentFilter === "Terminées" && !task.completed) return false;
        return true;
      })
      .filter((task) =>
        task.text.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
  }


        // PAGINATION
   
  getPaginatedTasks(filteredTasks) {
    const start = (this.currentPage - 1) * this.tasksPerPage;
    const end = start + this.tasksPerPage;
    return filteredTasks.slice(start, end);
  }


        // RENDER TACHES

  renderTasks() {
    this.taskList.innerHTML = "";

    const filtered = this.getFilteredTasks();
    const paginated = this.getPaginatedTasks(filtered);

    this.emptyBox.style.display = filtered.length === 0 ? "block" : "none";

    paginated.forEach((task) => {
      const div = document.createElement("div");
      div.className = "task";
      div.style.width = "100%";
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      div.style.border = "1px solid #eee";
      div.style.padding = "10px";
      div.style.borderRadius = "8px";
      div.style.marginBlock = "20px";

      div.innerHTML = `
                <div class="task-left" style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" ${
                      task.completed ? "checked" : ""
                    } data-id="${task.id}">
                    <span class="${
                      task.completed ? "done" : ""
                    }" style="font-size:16px; display: flex; flex-direction: row-reverse; align-items: center; gap: 10px;">
                        ${task.text}
                        <div style="background:${
                          task.priority === "eleve"
                            ? "red"
                            : task.priority === "Moyenne"
                            ? "orange"
                            : "green"
                        }; width: 12px; height: 12px; border-radius: 50%; diplay:inline-block; margin-left: 10px;"></div>
                            
                        </span>
                    </span>
                </div>
                <div class="task-actions" style="display:flex; gap:20px;">
                    <i class="fas fa-edit edit" data-id="${
                      task.id
                    }" style="cursor:pointer; color: green; font-size: 30px;"></i>
                    <i class="fas fa-trash delete" data-id="${
                      task.id
                    }" style="cursor:pointer; color: red; font-size: 30px;"></i>
                </div>
            `;
      this.taskList.appendChild(div);
    });

    this.updateStats();
    this.updatePagination(filtered.length);
  }


        // STATISTIQUES

  updateStats() {
    this.totalSpan.textContent = this.tasks.length;
    this.doneSpan.textContent = this.tasks.filter((t) => t.completed).length;
    this.pendingSpan.textContent = this.tasks.filter(
      (t) => !t.completed
    ).length;
  }


        // PAGINATION UI

  updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this.tasksPerPage);

    let container = document.getElementById("pagination");
    if (!container) {
      container = document.createElement("div");
      container.id = "pagination";
      container.style.margin = "0 auto";
      container.style.display = "flex";
      container.style.gap = "10px";
      container.style.justifyContent = "center";
      this.taskList.after(container);
    }

    container.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.style.padding = "5px 10px";
      btn.style.borderRadius = "6px";
      btn.style.border = "1px solid #ccc";
      if (i === this.currentPage) {
        btn.style.background = "var(--primary)";
        btn.style.color = "white";
      }
      btn.addEventListener("click", () => {
        this.currentPage = i;
        this.renderTasks();
      });
      container.appendChild(btn);
    }
  }

        // NOTIFICATIONS
 
  showNotification(message, type = "info") {
    const notif = document.createElement("div");
    notif.className = `notification ${type}`;
    notif.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
    this.notificationContainer.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  }


        // DARK MODE
  
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle("dark", this.darkMode);
    this.moonIcon.style.display = this.darkMode ? "none" : "inline-block";
    this.sunIcon.style.display = this.darkMode ? "inline-block" : "none";
    this.saveDarkModePreference();
  }

  saveDarkModePreference() {
    localStorage.setItem("darkMode", this.darkMode);
  }

  loadDarkModePreference() {
    this.darkMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark", this.darkMode);
    this.moonIcon.style.display = this.darkMode ? "none" : "inline-block";
    this.sunIcon.style.display = this.darkMode ? "inline-block" : "none";
  }

        // PERSISTANCE TACHES
   
  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  loadTasks() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    this.tasks = saved.map(
      (t) =>
        new Task(
          t.id,
          t.text,
          t.priority,
          t.completed,
          t.createdAt,
          t.description
        )
    );
    this.nextId =
      this.tasks.length > 0 ? Math.max(...this.tasks.map((t) => t.id)) + 1 : 1;
  }
}


  //  INITIALISATION DE L'APP

document.addEventListener("DOMContentLoaded", () => {
  const app = new TodoApp();
});
