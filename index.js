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
const TASKS_STORAGE_KEY = "to-do-tasks";

function loadTasks() {
	const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
	if (!savedTasks) {
		return items;
	}

	try {
		const parsedTasks = JSON.parse(savedTasks);
		if (Array.isArray(parsedTasks)) {
			return parsedTasks;
		}
	} catch (error) {
		console.error("Не удалось прочитать задачи из localStorage", error);
	}

	return items;
}

function createItem(item) {
	const template = document.getElementById("to-do__item-template");
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);
	const textElement = clone.querySelector(".to-do__item-text");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
	const editButton = clone.querySelector(".to-do__item-button_type_edit");
	textElement.textContent = item;

	deleteButton.addEventListener("click", () => {
		clone.remove();
		items = getTasksFromDOM();
		saveTasks(items);
	});

	duplicateButton.addEventListener("click", () => {
		const itemName = textElement.textContent;
		const newItem = createItem(itemName);
		listElement.prepend(newItem);
		items = getTasksFromDOM();
		saveTasks(items);
	});

	editButton.addEventListener("click", () => {
		textElement.setAttribute("contenteditable", "true");
		textElement.focus();
	});

	textElement.addEventListener("blur", () => {
		textElement.setAttribute("contenteditable", "false");
		items = getTasksFromDOM();
		saveTasks(items);
	});

	return clone;
}

function getTasksFromDOM() {
	return Array.from(listElement.querySelectorAll(".to-do__item-text")).map(
		(taskElement) => taskElement.textContent
	);
}

function saveTasks(tasks) {
	localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

formElement.addEventListener("submit", (event) => {
	event.preventDefault();
	const newTask = inputElement.value.trim();

	if (!newTask) {
		return;
	}

	const taskElement = createItem(newTask);
	listElement.prepend(taskElement);
	items = getTasksFromDOM();
	saveTasks(items);
	inputElement.value = "";
});

items = loadTasks();
items.forEach((item) => {
	const taskElement = createItem(item);
	listElement.append(taskElement);
});

