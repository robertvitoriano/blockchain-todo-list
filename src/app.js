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
    console.log('Contract loaded !!')
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
  render: async () => {

    if (App.loading) return

    App.setLoading(true);

    const accountElement = document.querySelector('#account');
    accountElement.innerHTML = "Account: " + App.account;

    App.setLoading(false);

  }

}

//start the app when browser loads
window.addEventListener('load', async () => {
  await App.load()
})