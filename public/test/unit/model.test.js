var chai = require('chai'),
    expect = chai.expect,

    // Mock objects
    Model = require('../../js/model.js'),
    m = new Model(),

    // Returned objects from model events
    returnedTask = null,
    returnedTaskId = null

// Run before all tests
before(function() {
    console.log('== Model Tests ==')

    // Register to model events
    m.taskCreated.register(function(task) {
        returnedTask = task
    })
    m.taskRemoved.register(function(id) {
        returnedTaskId = id
    })
    m.taskStateChanged.register(function(id) {
        returnedTaskId = id
    })
})

// Clear returned objects
beforeEach(function() {
    returnedTask = null
    returnedTaskId = null
    m.tasks = []
})

describe('#addTask method', function() {
    it('should create new task if it not exists', function() {
        var title = 'Task #1'

        m.addTask(title)

        expect(returnedTask).to.not.be.null
        expect(returnedTask).to.be.an('object')
        expect(returnedTask.title).to.equal(title)
        expect(returnedTask.done).to.be.false
    });
    it('should not create task if it already exists', function() {
        var title = 'Task #1'

        m.addTask(title)

        returnedTask = null

        m.addTask(title)

        expect(returnedTask).to.be.null
        expect(m.tasks.length).to.equal(1)
    });
    it('should not create task if the title is not starting with a digit or a letter', function() {
        m.addTask()
        m.addTask(null)
        m.addTask(undefined)
        m.addTask('')
        m.addTask('  ')
        m.addTask('     ')
        m.addTask(' fds    ')

        expect(returnedTask).to.be.null
    });
})

describe('#removeTask method', function() {
    it('should remove task if it exists', function() {
        var title = 'Task #2'

        m.addTask(title)

        m.removeTask(returnedTask.id)

        expect(returnedTaskId).to.not.be.null
        expect(returnedTaskId).to.be.equal(returnedTask.id)
    });
    it('should not remove task if it not exists', function() {
        m.removeTask(129460)

        expect(returnedTaskId).to.be.null
    });
    it('should do nothing if the id is invalid or empty', function() {
        m.removeTask()
        m.removeTask('jfdls')

        expect(returnedTaskId).to.be.null
    });
})

describe('#setTaskState method', function() {
    it('should change task state if it exists', function() {
        var title = 'Task #3'

        m.addTask(title)

        // Confirm task initial value.
        expect(returnedTask.done).to.be.false

        // Get the task from the model.
        var t = m.findTaskById(returnedTask.id)

        expect(t).to.be.equal(returnedTask)

        m.setTaskState(t.id, true)

        expect(t.done).to.be.true

        expect(returnedTaskId).to.be.equal(t.id)
    });
    it('should not change task state if it not exists', function() {
        m.setTaskState(14793, true)

        expect(returnedTaskId).to.be.null
    });
    it('should keep the task state if the new state is the same as the current state', function() {
        var title = 'Task #4'

        m.addTask(title)

        var task = m.findTaskById(returnedTask.id)

        expect(task).to.be.equal(returnedTask)
        expect(task.done).to.be.false

        m.setTaskState(task.id, false)

        expect(task.done).to.be.false
    });
    it('should do nothing if the state is invalid', function() {
        var title = 'Task #3'

        m.addTask(title)

        var task = m.findTaskById(returnedTask.id)

        m.setTaskState(task.id, 56)

        expect(returnedTaskId).to.be.null
    });
    it('should toggle task state if no state provided', function() {
        var title = 'Task #3'

        m.addTask(title)

        var task = m.findTaskById(returnedTask.id)

        expect(task.done).to.be.false

        m.setTaskState(task.id)

        expect(task.done).to.be.true

        m.setTaskState(task.id)

        expect(task.done).to.be.false
    });
})

describe('#findTaskById', function() {
    it('should return existing task', function() {
        var title = 'Task #4'

        m.addTask(title)

        var task = m.findTaskById(returnedTask.id)

        expect(task).to.be.equal(returnedTask)
    });
    it('should return null if the task does not exists', function() {
        var task = m.findTaskById(1234)

        expect(task).to.be.null
    });
    it('should return null if the id is invalid of empty', function() {
        var task = m.findTaskById(true)

        expect(task).to.be.null

        task = m.findTaskById()

        expect(task).to.be.null
    });
})