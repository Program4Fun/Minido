// Set global variables in case we run in node environment.
if (typeof window === "undefined") {
    // Get the chance object.
    var Chance = require('chance')
    var chance = new Chance()

    // Get the event object.
    var EventC = require('./event.js')
}

function Model() {
    // Properties
    this.tasks = []
    
    // Events
    this.taskCreated = new EventC()
    this.taskRemoved = new EventC()
    this.taskStateChanged = new EventC()
}

Model.prototype = {
    /**
     * Add new task.
     * 
     * @param {String} title the title of the new task
     */
    addTask(title) {
        // Confirm that the task is not already exists.
        if (this.tasks.filter(task => task.title === title).length === 0 &&
            /^\S/.test(title) &&
            title !== undefined &&
            title !== null) {
            // Create new task
            var task = {
                id: chance.guid(),
                title,
                created: new Date(Date.now()),
                done: false
            }

            this.tasks.push(task)

            // Notify to all listeners.
            this.taskCreated.notifyAll(task)
        }
    },
    /**
     * Remove task from the tasks list.
     * 
     * @param {String} id the id of the task to remove
     */
    removeTask(id) {
        var index = this.tasks.indexOf(this.findTaskById(id))

        if (index !== -1) {
            this.tasks.splice(index, 1)

            this.taskRemoved.notifyAll(id)
        }
    },
    /**
     * Change task done state (true / false).
     * 
     * @param {String} id the id of the task  
     * @param {Boolean} state the new state of the task
     */
    setTaskState(id, state) {
        var task = this.findTaskById(id)

        if (typeof state === "undefined") state = !task.done

        // Change the task state only if task exists.
        if (task !== null && typeof state === "boolean") {
            task.done = state
            
            this.taskStateChanged.notifyAll(id, state)
        }

    },
    findTaskById(id) {
        for (var task of this.tasks) {
            if (task.id === id) {
                return task
            }
        }

        return null
    }
}

if (typeof window === "undefined") {
    module.exports = Model
}