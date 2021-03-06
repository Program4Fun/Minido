function View(model) {
    // DOM Elements.
    this.userInput = document.getElementById('taskInput')
    this.taskList = document.getElementById('taskList')
    this.exportBtn = document.getElementById('exportBtn')
    this.importBtn = document.getElementById('importBtn')

    // Properties.
    this.model = model

    // Registrations.
    this.model.taskCreated.register(this.addTask.bind(this))
    this.model.taskRemoved.register(this.removeTask.bind(this))
    this.model.taskStateChanged.register(this.setTaskState.bind(this))
}

View.prototype = {
    /**
     * Clear the task input.
     */
    clearInput() {
        this.userInput.value = ''
    },
    /**
     * Add task to the tasks list.
     * 
     * @param {Object} task the newly created task
     */
    addTask(task) {
        this.clearInput()

        // Create the task list item
        var listItem = document.createElement('li')
        listItem.setAttribute('id', task.id)
        var label = document.createElement('label')
        var cb = document.createElement('input')
        cb.type = 'checkbox'
        cb.checked = task.done
        label.appendChild(cb)
        label.appendChild(document.createTextNode(task.title))
        var d = document.createElement('button')
        d.appendChild(document.createTextNode('X')) 
        d.onclick = this.model.removeTask.bind(this.model, task.id)
        listItem.appendChild(label)
        listItem.appendChild(d) 

        this.taskList.appendChild(listItem)
    },
    /**
     * Remove task from the tasks list.
     */
    removeTask(id) {
        var elem = document.getElementById(id)
        this.taskList.removeChild(elem)
    },
    /**
     * Change task item checked state based on task done state.
     * 
     * @param {String} id the id of the task
     * @param {Boolean} state the state of the task
     */
    setTaskState(id, state) {
        var listItem = document.getElementById(id)
        var cb = listItem.querySelector('input[type="checkbox"]')

        cb.setAttribute('checked', state)
        if (state) {
            listItem.classList.add('done')
        } else {
            listItem.classList.remove('done')
        }
    }
}

if (typeof window === "undefined") {
    module.exports = View
}