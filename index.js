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
		saveTasks(getTasksFromDOM());
	});

	duplicateButton.addEventListener("click", () => {
		const duplicatedItem = createItem(textElement.textContent);
		listElement.append(duplicatedItem);
		saveTasks(getTasksFromDOM());
	});

	editButton.addEventListener("click", () => {
		const newText = prompt("Измените задачу", textElement.textContent);
		if (newText === null) {
			return;
		}

		const trimmedText = newText.trim();
		if (!trimmedText) {
			return;
		}

		textElement.textContent = trimmedText;
		saveTasks(getTasksFromDOM());
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

function renderTasks(tasks) {
	listElement.innerHTML = "";
	tasks.forEach((task) => {
		const taskElement = createItem(task);
		listElement.append(taskElement);
	});
}

formElement.addEventListener("submit", (event) => {
	event.preventDefault();
	const newTask = inputElement.value.trim();

	if (!newTask) {
		return;
	}

	const taskElement = createItem(newTask);
	listElement.append(taskElement);
	inputElement.value = "";
	saveTasks(getTasksFromDOM());
});

const loadedTasks = loadTasks();
renderTasks(loadedTasks);
saveTasks(getTasksFromDOM());

