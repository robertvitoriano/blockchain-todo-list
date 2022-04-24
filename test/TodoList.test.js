const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList',(accounts)=>{
  before(async()=>{
    this.todoList = await TodoList.deployed()
  })
  it('Deploys successfully', async()=>{
    const address =await this.todoList.address
    assert.notEqual(address,0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  })
  
  it('Lists tasks', async()=>{
    const taskCount = await this.todoList.taskCount()
    const task = await this.todoList.tasks(taskCount)
    assert.equal(task.id.toNumber(), taskCount.toNumber())
    assert.equal(task.content, "Check out this contract")
    assert.equal(task.completed, false)
    assert.equal(taskCount.toNumber(), 1)
  })

  it('Creates tasks', async()=>{
    const newTaskContent = 'A new task'
    const result = await this.todoList.createTask(newTaskContent)
    const taskCount  =  await this.todoList.taskCount()
    const createdTaskEventInfo = result.logs[0].args
    const createdTaskId = createdTaskEventInfo.id.toNumber()
    const createdTaskContent = createdTaskEventInfo.content
    const createdTaskCompleted = createdTaskEventInfo.completed
    const eventName = result.logs[0].event
    assert.equal(taskCount, createdTaskId)
    assert.equal(createdTaskContent, newTaskContent)
    assert.equal(createdTaskCompleted, false)
    assert.equal(eventName, 'TaskCreated')
  })

  it('toggles task completion', async () => {
    const result = await this.todoList.toggleCompleted(1)
    const task = await this.todoList.tasks(1)
    assert.equal(task.completed, true)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1)
    assert.equal(event.completed, true)
  })
})