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
    const result = await this.todoList.createTask('A new task')
    const taskCount  =  await this.todoList.taskCount()
    const createdTaskEventInfo = result.logs[0].args
    const createdTaskId = createdTaskEventInfo.id.toNumber()
    const eventName = result.logs[0].event
    assert.equal(taskCount, createdTaskId)
    assert.equal(eventName, 'TaskCreated')
  })
})