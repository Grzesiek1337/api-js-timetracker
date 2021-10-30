const apikey = ''; // To test this API look in README file.
const apihost = 'https://todo-api.coderslab.pl';


function apiListTasks() {
    return fetch(
        apihost + '/api/tasks', {
            headers:
                {
                    Authorization: apikey
                }
        }).then(responseWithTasks => {
            if (!responseWithTasks.ok) {
                alert('An error occurred while connecting to the API');
            }
            return responseWithTasks.json();
        }
    );
}

function apiCreateNewTask(title, description) {
    return fetch(
        apihost + '/api/tasks', {
            headers:
                {
                    Authorization: apikey,
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }).then(responseWithTasks => {
            if (!responseWithTasks.ok) {
                alert('');
            }
            return responseWithTasks.json();
        }
    );
}

function apiUpdateTask(taskId, title, description, status) {
    return fetch(
        apihost + '/api/tasks/' + taskId, {
            headers:
                {
                    Authorization: apikey,
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify({title: title, description: description, status: status}),
            method: 'PUT'
        }).then(responseWithTasks => {
            if (!responseWithTasks.ok) {
                alert('An error occurred while connecting to the API');
            }
            return responseWithTasks.json();
        }
    );
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId, {
            headers:
                {
                    Authorization: apikey
                },
            method: 'DELETE'
        }).then(responseWithTasks => {
            if (!responseWithTasks.ok) {
                alert('An error occurred while connecting to the API');
            }
            return responseWithTasks.json();
        }
    )
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations', {
            headers:
                {
                    Authorization: apikey
                }
        }).then(responseWithTasks => {
            return responseWithTasks.json();
        }
    );
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations', {
            headers:
                {
                    Authorization: apikey,
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }).then(responseWithTasks => {
            if (!responseWithTasks.ok) {
                alert('An error occurred while connecting to the API');
            }
            return responseWithTasks.json();
        }
    );
}

function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(
        apihost + '/api/operations/' + operationId, {
            headers:
                {
                    Authorization: apikey,
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify({description: description, timeSpent: timeSpent}),
            method: 'PUT'
        }).then(responseWithTasks => {
            if (!responseWithTasks.ok) {
                alert('An error occurred while connecting to the API');
            }
            return responseWithTasks.json();
        }
    );
}

function apiDeleteOperation(operationId) {
    return fetch(
        apihost + '/api/operations/' + operationId, {
            headers:
                {
                    Authorization: apikey
                },
            method: 'DELETE'
        }).then(responseWithTasks => {
            if (!responseWithTasks.ok) {
                alert('An error occurred while connecting to the API');
            }
            return responseWithTasks.json();
        }
    )
}

function renderTask(taskId, title, description, status) {
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);
        finishButton.addEventListener('click', function () {
            apiUpdateTask(taskId, title, description, 'closed');
            section.querySelectorAll('.js-task-open-only').forEach(
                element => {
                    element.parentElement.removeChild(element);
                }
            );
        });
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);
    deleteButton.addEventListener('click', function () {
        apiDeleteTask(taskId).then(function () {
            section.parentElement.removeChild(section);
        });
    });

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    section.appendChild(ul);

    apiListOperationsForTask(taskId).then(
        responseWithTasks => {
            responseWithTasks.data.forEach(operation => {
                renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
            })
        })
    if (status === 'open') {
        const addOperationDiv = document.createElement('div');
        addOperationDiv.className = 'card-body js-task-open-only';
        section.appendChild(addOperationDiv);

        const form = document.createElement('form');
        addOperationDiv.appendChild(form);

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        form.appendChild(inputGroup);

        const descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('placeholder', 'Operation description');
        descriptionInput.setAttribute('minlength', '5');
        descriptionInput.className = 'form-control';
        inputGroup.appendChild(descriptionInput);

        const inputGroupAppend = document.createElement('div');
        inputGroupAppend.className = 'input-group-append';
        inputGroup.appendChild(inputGroupAppend);

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-info';
        addButton.innerText = 'Add';
        inputGroupAppend.appendChild(addButton);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            apiCreateOperationForTask(taskId, descriptionInput.value).then(responseWithTasks => {
                renderOperation(ul, status, responseWithTasks.data.id, responseWithTasks.data.description,
                    responseWithTasks.data.timeSpent
                );
            })
            form.reset();
        });
    }
}

function renderOperation(ul, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    ul.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = formatTime(timeSpent);
    descriptionDiv.appendChild(time);

    if (status === "open") {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'js-task-open-only';
        li.appendChild(controlDiv);

        const add15minButton = document.createElement('button');
        add15minButton.className = 'btn btn-outline-success btn-sm mr-2';
        add15minButton.innerText = '+15m';
        controlDiv.appendChild(add15minButton);

        add15minButton.addEventListener('click', function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(
                responseWithTasks => {
                    time.innerText = formatTime(responseWithTasks.data.timeSpent);
                    timeSpent = responseWithTasks.data.timeSpent;
                }
            );
        });

        const add1hButton = document.createElement('button');
        add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
        add1hButton.innerText = '+1h';
        controlDiv.appendChild(add1hButton);

        add1hButton.addEventListener('click', function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(responseWithTasks => {
                    time.innerText = formatTime(responseWithTasks.data.timeSpent);
                    timeSpent = responseWithTasks.data.timeSpent;
                }
            );
        });
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm';
        deleteButton.innerText = 'Delete';
        controlDiv.appendChild(deleteButton);

        deleteButton.addEventListener('click', function () {
            apiDeleteOperation(operationId).then(
                function () {
                    li.parentElement.removeChild(li);
                }
            );
        });
    }
}

function formatTime(totalCountTime) {
    const hours = Math.floor(totalCountTime / 60);
    const minutes = totalCountTime % 60;
    if (hours > 0) {
        return hours + 'h ' + minutes + 'm';
    } else {
        return minutes + 'm';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    apiListTasks().then(responseWithTasks => {
        responseWithTasks.data.forEach(task => {
            renderTask(task.id, task.title, task.description, task.status);
        })
    });
    const taskForm = document.querySelector("#taskform");
    taskForm.addEventListener('submit', e => {
        e.preventDefault();
        apiCreateNewTask(e.target.elements.title.value, e.target.elements.description.value).then(
            responseWithTasks => {
                renderTask(responseWithTasks.data.id, responseWithTasks.data.title, responseWithTasks.data.description, responseWithTasks.data.status)
                taskForm.reset();
            })
    });
});