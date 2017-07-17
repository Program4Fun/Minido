function Controller(view, model) {
    this.view = view
    this.model = model

    this.view.userInput.addEventListener('keypress', this.handleEnterKeyPress.bind(this))
    this.view.taskList.addEventListener('change', this.handleTaskToggleState.bind(this), true)
}

Controller.prototype = {
    handleEnterKeyPress(e) {
        // Check if enter key pressed.
        if (e.keyCode == 13) {
            var title = this.view.userInput.value

            this.model.addTask(title)
        }
    },
    handleTaskToggleState(e) {
        var id = e.target.parentElement.parentElement.getAttribute('id')

        this.model.setTaskState(id)
    }
}

if (typeof window === "undefined") {
    module.exports = Controller
}