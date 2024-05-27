
function createTaskElement(name, description, columnId) {
    const taskElement = document.createElement('div');
    taskElement.className = 'taskElement';
    // Define o conteúdo interno do elemento 'taskElement' usando uma template string
    taskElement.innerHTML = `
        <h3 class="taskTitle">${name}</h3>
        <p class="taskDescription">${description}</p>
        <button onclick="removeTask(parentElement)">X Remover</button>
    `;
    taskElement.draggable = true;
    // Define o id do elemento 'taskElement' como 'taskElement-' seguido da data e hora atual em milissegundos
    taskElement.id = `taskElement-${Date.now()}`;
    taskElement.addEventListener("dragstart", drag);

    console.log(`ID: ${taskElement.id}`)
    // Seleciona o elemento com o id igual a 'columnId' e o armazena na constante 'column'
    const column = document.getElementById(columnId);
    // Anexa o elemento 'taskElement' ao final do elemento 'column'
    column.appendChild(taskElement);

    saveTask()
    return taskElement;
}

function addTask(columnId) {
    // Seleciona o campo de nome e descrição da tarefa com base no 'columnId' fornecido
    const nameField = document.getElementById(columnId + "-name");
    const descriptionField = document.getElementById(columnId + "-description");
    const name = nameField.value;
    const description = descriptionField.value;

    if (name !== "" && description !== "") {
        // Cria um novo elemento de tarefa com o nome, descrição e id da coluna fornecidos
        createTaskElement(name, description, columnId);

        saveTask(name, description, columnId);
        // Limpa os campos de nome e descrição após a criação da tarefa
        nameField.value = "";
        descriptionField.value = "";
    } else {
        alert("INSIRA UM NOME E DESCRIÇÃO PARA A TASK")
    }
}

function saveTask() {
    // Seleciona todos os elementos com a classe 'column' e os armazena na constante 'columns'
    const columns = document.querySelectorAll('.column');

    // Cria um objeto vazio 'tasks' para armazenar as tarefas
    const tasks = {};

    // Para cada coluna, executa a função de callback
    columns.forEach(column => {
        const columnId = column.id;
        const tasksColumn = column.querySelectorAll('.taskElement')
        const taskContent = []

        tasksColumn.forEach(task => {
            const taskName = task.querySelector('.taskTitle').innerText;
            const taskDescription = task.querySelector('.taskDescription').innerText
            // Adiciona um objeto com o nome e a descrição da tarefa ao array 'taskContent'
            taskContent.push({ name: taskName, description: taskDescription })
        })
        // Adiciona o array 'taskContent' ao objeto 'tasks' com a chave sendo o id da coluna
        tasks[columnId] = taskContent
    })
    localStorage.setItem('tasks', (JSON.stringify(tasks)))
}

function removeTask(taskElement) {

    const confirmRemove = confirm('Tem certeza que deseja remover?');

    if (confirmRemove) {
        taskElement.remove();
        saveTask();
    }
    console.log(taskElement);
}

function loadTasks() {
    const columns = document.querySelectorAll('.column');

    // Recupera as tarefas do armazenamento local e as converte de uma string JSON para um objeto JavaScript, armazenando-as na constante 'tasks'
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    // Verifica se existem tarefas armazenadas localmente
    if (tasks) {

        columns.forEach(column => {
            const columnId = column.id
            // Obtém o conteúdo da tarefa para a coluna atual do objeto 'tasks' e o armazena na constante 'taskContent'
            const taskContent = tasks[columnId]
            // Verifica se existe conteúdo da tarefa para a coluna atual
            if (taskContent) {
                // Para cada tarefa no conteúdo da tarefa, executa a função de callback
                taskContent.forEach(task => {

                    const taskName = task.name
                    const taskDescription = task.description

                    // Cria um novo elemento de tarefa com o nome, descrição e id da coluna fornecidos, e o armazena na constante 'taskElement'
                    const taskElement = createTaskElement(taskName, taskDescription, columnId)
                    // Anexa o elemento 'taskElement' ao final do elemento com o id igual a '${columnId}-taskContent'
                    document.getElementById(`${columnId}-taskContent`).appendChild(taskElement)
                })
            }
        })
    }
}


// A função 'allowDrop' impede que o comportamento padrão do navegador ocorra quando um elemento é arrastado sobre outro
function allowDrop(event) {
    console.log("allowDrop+");
    event.preventDefault();
}

// A função 'dragStart' é chamada quando o usuário começa a arrastar um elemento
function dragStart(event) {
    console.log("Dragstart");
    console.log(event);

    console.log(`Dragging ID: ${event.target.id}`);
    // o id do elemento sera transferido
    event.dataTransfer.setData("text/plain", event.target.id);
}


// A função 'drop' é chamada quando um elemento arrastado é solto
function drop(ev) {
    ev.preventDefault();

    const data = ev.dataTransfer.getData("text");
    // Busca o elemento que está sendo arrastado pelo seu id
    const draggedElement = document.getElementById(data)

    // Inicializa a coluna alvo onde o elemento será solto
    let targetColumn = ev.target;

    // Encontra a coluna alvo percorrendo os elementos do evento
    while (targetColumn && !targetColumn.classList.contains('column')) {
        targetColumn = targetColumn.parentElement;
    }

    // Se uma coluna alvo foi encontrada
    if (targetColumn) {
        // Cria um novo elemento de tarefa com os mesmos dados do elemento arrastado
        const newTask = createTaskElement(
            draggedElement.querySelector('.taskTitle').innerText,
            draggedElement.querySelector('.taskDescription').innerText,
            draggedElement.id
        );

        // Adiciona a nova tarefa à coluna alvo
        targetColumn.querySelector('.taskContainer').appendChild(newTask);

        // Remove o elemento arrastado do seu local original
        draggedElement.parentElement.removeChild(draggedElement);
        saveTask();
    }
}

// A função 'drag' é chamada quando um elemento começa a ser arrastado
function drag(ev) {
    // Define os dados do elemento que está sendo arrastado
    ev.dataTransfer.setData("text", ev.target.id);
}

loadTasks();