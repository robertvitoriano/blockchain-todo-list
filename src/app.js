const App = {
  loading: false,
  contracts: {},
  load: async () => {
    //Load App...
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    console.log('App loading !!')

  },
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */ })
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */ })
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
  },
  loadContract: async () => {
    const todoList = await $.getJSON('TodoList.json');
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);
    App.todoList = await App.contracts.TodoList.deployed();
  },
  setLoading: (loadingState) => {
    App.loading = loadingState;
    const loader = document.querySelector('#loader');
    const content = document.querySelector('#content')
    if (loadingState) {
      loader.style.display = 'block'
      content.style.display = 'none'
    } else {
      loader.style.display = 'none'
      content.style.display = 'block'
    }
  },
  toggleComplete: (event, taskId) => {
    const completedTasksList = document.querySelector('#completed-task-list');
    const uncompletedTasksList = document.querySelector('#task-list');
    const taskToToggle = document.querySelector(`.task-${taskId}`)
    const taskContentToToggle = taskToToggle.querySelector('.task-content')

    if(taskContentToToggle.style.textDecoration === 'line-through'){
      const checkedTask = taskToToggle.cloneNode(true)
      checkedTask.addEventListener('click', (event)=>App.toggleComplete(event, taskId))
      uncompletedTasksList.appendChild(checkedTask)
      taskToToggle.remove()
    }else{
      const checkedTask = taskToToggle.cloneNode(true)
      checkedTask.addEventListener('click', (event)=>App.toggleComplete(event, taskId))
      completedTasksList.appendChild(checkedTask)
      taskToToggle.remove()
    }
  },
  renderTasks: async () => {
    const taskCount = await App.todoList.taskCount()
    const taskTemplate = document.querySelector('.taskTemplate');
    for (let i = 1; i <= taskCount.toNumber(); i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      const newTaskElement = taskTemplate.cloneNode(true);
      newTaskElement.style.display = 'block'
      newTaskElement.classList.remove('taskTemplate')
      const newTaskElementClasses = ['task-item', `task-${taskId}`]
      newTaskElement.classList.add(...newTaskElementClasses)
      const completedTasksList = document.querySelector('#completed-task-list');
      const uncompletedTasksList = document.querySelector('#task-list');
      if(taskCompleted){
        completedTasksList.appendChild(newTaskElement)
      }else{
        uncompletedTasksList.appendChild(newTaskElement)
      }

      const newTaskContent = newTaskElement.querySelector('.content')
      const newTaskContentClasses = ['task-content', `task-content-${taskId}`]
      newTaskContent.classList.add(...newTaskContentClasses);
      newTaskContent.classList.remove('content')
      newTaskContent.innerHTML = taskContent

      const newTaskCheckbox = newTaskElement.querySelector('input')
      const newTaskCheckboxClasses = ['task-checkbox', `task-checkbox-${taskId}`]
      newTaskCheckbox.classList.add(...newTaskCheckboxClasses)
      newTaskCheckbox.checked = taskCompleted
      newTaskCheckbox.addEventListener('click', (event)=>App.toggleComplete(event, taskId))
    }
  },
  render: async () => {

    if (App.loading) return

    App.setLoading(true);

    const accountElement = document.querySelector('#account');
    accountElement.innerHTML = "Account: " + App.account;
    await App.renderTasks();

    App.setLoading(false);
  }
}

//start the app when browser loads
window.addEventListener('load', async () => {
  await App.load()
})