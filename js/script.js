const nameInput = document.querySelector("#name");
const todoCount = document.querySelector(".todo-count");
const todoForm = document.querySelector(".todo-form");
const inputContent = document.querySelector(".input-content");
const newTodosContainer = document.querySelector(".new-todos");
let todos = JSON.parse(localStorage.getItem("todos")) || [];
if (localStorage.getItem("todos")) {
  todos.map((todo) => {
    displayTodo(todo);
    countTodo();
  });
}

window.addEventListener("load", () => {
  const username = localStorage.getItem("username") || "";
  nameInput.focus();
  nameInput.value = username;

  //Set name as username and save in localstorage
  nameInput.addEventListener("change", (e) => {
    localStorage.setItem("username", e.target.value);
  });
});

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = inputContent.value;
  if (inputValue === "") return;
  const todo = {
    content: inputValue,
    id: new Date().getTime(),
    category: e.target.elements.category.value,
    isDone: false,
  };
  //Add the todo to the todos object and save in localStorage
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
  inputContent.focus();
  todoForm.reset();

  displayTodo(todo);
  countTodo();
});

function displayTodo(todo) {
  const todoItem = document.createElement("div");
  todoItem.setAttribute("id", todo.id);

  if (todo.isDone) todoItem.classList.add("done");
  todoItem.classList.add("todo-item");
  const markup = `
  <label class="input-label">
    <input type="checkbox" class="input-check" ${
      todo.isDone ? "checked" : null
    }/>
      <ion-icon
        name="checkmark-${todo.isDone ? "circle" : "circle-outline"}"
        class="${todo.category} icon">
      </ion-icon>
  </label>
  <textarea
    type="text"
    value="${todo.content}"
    readonly
    name="content"
    class='input-content'
    id="contentInput"
  >${todo.content}</textarea>
  <div class="actions">
    <button class="edit-btn">Edit</button>
    <button class="save-btn hidden">Save</button>
    <button class="delete-btn">Delete</button>
  </div>
  `;
  todoItem.innerHTML = markup;
  newTodosContainer.appendChild(todoItem);

  const input = document.querySelector(".input-check");
  input.checked = todo.isDone;
  console.log(input.checked);
}

function countTodo() {
  // console.log(todos.length);
  todoCount.innerHTML = todos.length;
  const totalTodos = todos.length;
  console.log(totalTodos);
  const completedTodos = todos.filter((todo) => todo.isDone === true);
  console.log(completedTodos);
  remainingTodo = totalTodos - completedTodos.length;
  todoCount.innerHTML = `${remainingTodo} todo(s) left`;
}

newTodosContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    e.target.classList.add("hidden");
    e.target.nextSibling.nextSibling.classList.remove("hidden");
    console.log(inputContent);
    inputContent.classList.add("editable");
    console.log(e.target);
    console.log(e.target.nextSibling.nextSibling);

    const todoItem = e.target.parentNode.parentNode;
    console.log(todoItem);
    const todoId = todoItem.id;
    console.log(todoId);
    editTodo(todoId, todoItem);
  }
  if (e.target.classList.contains("save-btn")) {
    e.target.classList.add("hidden");
    e.target.previousSibling.previousSibling.classList.remove("hidden");
    const todoItem = e.target.parentNode.parentNode;
    const todoId = todoItem.id;
    saveTodo(todoId, todoItem);
  }
  if (e.target.classList.contains("input-check")) {
    const todoItem = e.target.parentNode.parentNode;
    const todoId = todoItem.id;
    const todo = todos.find((todo) => todo.id === parseInt(todoId));

    console.log(todoItem);
    console.log(e.target);
    const icon = todoItem.querySelector(".icon");
    const inputRadio = e.target;
    icon.name = "checkmark-circle";
    todo.isDone = inputRadio.checked;
    localStorage.setItem("todos", JSON.stringify(todos));
    console.log(todo);
    // todos.push(todo)

    console.log(icon);
    if (todo.isDone) {
      todoItem.classList.add("done");
      icon.name = "checkmark-circle";
      console.log("checked");
    } else {
      console.log("unchecked");
      icon.name = "checkmark-circle-outline";
      // todo.isDone = !todo.isDone;
      todoItem.classList.remove("done");
    }
    // displayTodo(todo)
    localStorage.setItem("todos", JSON.stringify(todos));
    countTodo();
  }
  if (e.target.classList.contains("delete-btn")) {
    const todoItem = e.target.parentNode.parentNode;
    console.log(todoItem);
    const todoId = todoItem.id;
    console.log(todoId);
    deleteTodo(todoId);
    // const todo = todos.find((todo) => todo.id === parseInt(todoId));
    // todos = todos.filter(t => t != todo)
    // localStorage.setItem('todos', JSON.stringify(todos))
    // todos.map((todo) => {
    //   displayTodo(todo);
    //   countTodo();
    // });
  }
});

// newTodosContainer.addEventListener('click', e => {
//   const todoId = e.target.closest('div').id
//   editTodo(todoId, e.target)
// })

function editTodo(todoId, el) {
  const todo = todos.find((todo) => todo.id === parseInt(todoId));
  console.log(el);
  const input = el.querySelector("#contentInput");
  console.log(input);
  if (input.hasAttribute("readonly")) {
    input.focus();
    input.classList.add("editable");
    input.removeAttribute("readonly");
  }
}

function saveTodo(todoId, el) {
  const todo = todos.find((todo) => todo.id === parseInt(todoId));
  const input = el.querySelector("#contentInput");
  input.classList.remove("editable");
  input.setAttribute("readonly", "true");
  todo.content = input.value;
  localStorage.setItem("todos", JSON.stringify(todos));
  // displayTodo(todos);
  countTodo();
}

function deleteTodo(todoId) {
  newTodosContainer.innerHTML = "";
  const todo = todos.find((todo) => todo.id === parseInt(todoId));
  todos = todos.filter((t) => t != todo);
  localStorage.setItem("todos", JSON.stringify(todos));
  todos.map((todo) => displayTodo(todo));
  countTodo();
}
