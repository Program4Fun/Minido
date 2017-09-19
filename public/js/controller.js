function Controller(view, model) {
    this.view = view
    this.model = model

    this.view.userInput.addEventListener('keypress', this.handleEnterKeyPress.bind(this))
    this.view.taskList.addEventListener('change', this.handleTaskToggleState.bind(this), true)
    this.view.exportBtn.addEventListener('click', this.handleExportButtonClick.bind(this))

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        this.view.importBtn.addEventListener('change', this.handleImportButtonChange.bind(this))
    } else {
        this.view.importBtn.style.display = 'none'
    }
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
    },
    handleExportButtonClick(e) {
        download(JSON.stringify(this.model.tasks), 'data.json', 'application/json')
    },
    handleImportButtonChange(e) {
        var file = e.target.files[0],
            reader = new FileReader()

        reader.onload = (function(e) {
            this.model.addTaskList(JSON.parse(e.target.result), true)
        }).bind(this)

        reader.readAsText(file)
    }
}

if (typeof window === "undefined") {
    module.exports = Controller
}