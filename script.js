
const input = document.getElementById('task-input');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

//Tableau init pour les tâches
let tasks =[];

//fct de sauv
function saveTasks(){
    //on stock en Json
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

//fct de chargement
function loadTasks(){
    const raw = localStorage.getItem('todo_tasks');
    if (!raw) return;
    try{
        tasks = JSON.parse(raw);
    } catch (e) {
        tasks=[];
        console.error('Erreur parsing localStorage', e);
    }
}

//afficher les tâches
function renderTasks(){
    //on vide la liste avant de réaffichage
    taskList.innerHTML='';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task' + (task.done ? ' done' : '');
        li.dataset.id = task.id; // id pour retrouver la tâche

        const span = document.createElement('span');
        span.className = 'text';
        span.textContent = task.text;

        //supprimer
        const actions = document.createElement('div');
        actions.className = 'actions';

        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.className = 'btn_del' ;
        //double-clique pour supp
        del.addEventListener('click', (e) => {
            e.stopPropagation(); 
            deleteTask(task.id);
        });
        
        actions.appendChild(del);

        const fait = document.createElement('button');
        fait.textContent = 'Done';
        fait.className = 'btn_Fait' ;
        //un click pour marquer comme fait
        fait.addEventListener('click', (e) => {
            e.stopPropagation(); 
            toggleDone(task.id);
        });

        actions.appendChild(fait);

        li.appendChild(span);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

//manipulation de tâches
function addTask(text){
    const newTask = {
        id: Date.now().toString(), // identifiant simple et unique
        text: text.trim(),
        done: false
    };

    if (!newTask.text) return;
    tasks.push(newTask);
    saveTasks();
    renderTasks(); // met à jour l'affichage 
}

function deleteTask(id){
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function toggleDone(id){
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done} : t);
    saveTasks();
    renderTasks();
}

// Evénements util
addBtn.addEventListener('click', () => {
    addTask(input.value);
    input.value = '';
    input.focus();
});

//Appuyer sur Entrée pour ajouter
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// Initilisation
loadTasks();
renderTasks();