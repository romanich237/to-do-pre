let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const templateElement = document.getElementById("to-do__item-template");

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks !== null) {
    return JSON.parse(savedTasks);
  }

  return items;
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
  const tasks = [];

  itemsNamesElements.forEach(function (itemNameElement) {
    tasks.push(itemNameElement.textContent);
  });

  return tasks;
}

function createItem(item) {
  const clone = templateElement.content
    .querySelector(".to-do__item")
    .cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;

  deleteButton.addEventListener("click", function () {
    clone.remove();

    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  duplicateButton.addEventListener("click", function () {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);

    listElement.prepend(newItem);

    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  editButton.addEventListener("click", function () {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  textElement.addEventListener("blur", function () {
    textElement.setAttribute("contenteditable", "false");

    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  return clone;
}

function handleFormSubmit(evt) {
  evt.preventDefault();

  const itemName = inputElement.value.trim();

  if (itemName === "") {
    return;
  }

  const newItem = createItem(itemName);
  listElement.prepend(newItem);

  items = getTasksFromDOM();
  saveTasks(items);

  inputElement.value = "";
}

formElement.addEventListener("submit", handleFormSubmit);

items = loadTasks();

items.forEach(function (item) {
  const taskElement = createItem(item);
  listElement.append(taskElement);
});
