import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs'
import $ from 'jquery'; 
import TruffleContract from './truffle-config';
import Web3 from 'web3';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import logo from './logo.png'; 


import "./App.css";

class App extends Component {

  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  async componentDidMount(){

    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    
    this.initWeb3();
  };

  initWeb3 = async () =>{ 

    console.log("i got here")



    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })



    /*
    // Modern dapp browsers...
    if (window.ethereum) {
      this.state.web3 = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
        console.log("User granted account access")
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.this.state.web3) {
      this.state.web3 = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      this.state.web3 = new getWeb3.providers.HttpProvider('http://127.0.0.1:7545');
    }
    
    this.instantiateContract()
    */



  }
  


  constructor(props) {
    super(props)


    this.state = {
      storageValue: 0, 
      ipfsHash : '',
      web3: null,
      buffer: null,
      account: null
    }
  
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }



  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    //const web3 = getWeb3();


    
    /*
    console.log("got here contract 1")

    var json = require('./SimpleStorage.json');
    console.log("got here contract 2", json)

    const contract = require('truffle-contract')
    const simpleStorage = contract(json)

    const web3 = new Web3(window.web3.currentProvider);
    
    simpleStorage.setProvider(web3.currentProvider);

    // Get accounts.
    web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        return this.simpleStorageInstance.get.call("Adewole", "Babatunde", "MCB/2013/024")
      }).then((ipfsHash) => {
        // Update state with the result.
        return this.setState({ ipfsHash })
      })
    })
    */


    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        return this.simpleStorageInstance.get.call("Adewole", "Babatunde", "MCB/2013/024")
      }).then((ipfsHash) => {
        // Update state with the result.
        console.log("ipfsHash", ipfsHash)
        return this.setState({ ipfsHash })
      })
    })


    



    /*
    
    $.getJSON('./SimpleStorage.json', function(dataa) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      console.log("got here contract 2")
      

      var AdoptionArtifact = dataa;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);


      


      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

    

  // Use our contract to retrieve and mark the adopted pets
  //return App.markAdopted();
});

*/




  /*  
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)



    console.log("account logged", this.state.web3.eth.defaultAccount)

    var saveInstance;

    this.state.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.SimpleStorage.deployed().then(function(instance) {
        saveInstance = instance;

        // Execute adopt as a transaction by sending account
        return saveInstance.SetStudentInfo("Adewole", "Babatunde", "MCB/2013/024", "QmPtuhMRbLZW9BtbvsLoAKzCoHUtBL56vuaHMi4fWhfMAB", {from: account});
      }).then(function(result) {
        console.log('success', 'transaction successful');
        //return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  */

  } 



  captureFile(event){
    console.log('captureFile....')
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader() 
    reader.readAsArrayBuffer(file)
    reader.onloadend = () =>{
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }

      
  }

  onSubmit(event){

    event.preventDefault()
    var firstName = document.getElementById('firstName').value
    var surname = document.getElementById('surname').value
    var matricNo = document.getElementById('matricNo').value
    
    if(firstName.length==0){
      alert("Firstname cannot be empty");
      document.getElementById('firstName').innerHTML = "Firstname cannot be empty";
    }else if(surname.length == 0){
      alert("Surname cannot be empty");
      document.getElementById('surname').innerHTML = "Surname cannot be empty";
    }else if(matricNo.length == 0){
      alert("Matriculation Number cannot be empty");
      document.getElementById('matricNo').innerHTML = "Matriculation Number cannot be empty";
    }else{
            


      
      console.log('submit...')

      //-----set
      /*
      ipfs.files.add(this.state.buffer, (error, result) => {
        if(error) {
          console.error(error)
          return
        }
        this.simpleStorageInstance.set("Oyinkansola", "Ifarajimi", "PHI/2015/014", result[0].hash, { from: this.state.account }).then((r) => {
          return this.setState({ ipfsHash: result[0].hash })
          console.log('ifpsHash', this.state.ipfsHash)
        })
      })
      */


      //----get
      
      const contract = require('truffle-contract')
      const simpleStorage = contract(SimpleStorageContract)
      simpleStorage.setProvider(this.state.web3.currentProvider)

      // Get accounts.
      this.state.web3.eth.getAccounts((error, accounts) => {
        simpleStorage.deployed().then((instance) => {
          this.simpleStorageInstance = instance
          this.setState({ account: accounts[0] })
          // Get the value from the contract to prove it worked.
          return this.simpleStorageInstance.get.call("Oyinkansola", "Ifarajimi", "PHI/2015/014")
        }).then((ipfsHash) => {
          // Update state with the result.
          console.log("ipfsHash", ipfsHash)
          return this.setState({ ipfsHash })
        })
      })
    

    }




    

    //---set hash
    /*

    //add file to IPFS

    console.log('submit....')
      
      ipfs.files.add(this.state.buffer, (error, result) => {
        if(error){
          console.error('got an error', error) 
        return
      }
      console.log('ipfsHash', result[0].hash)


    this.simpleStorageInstance.set(firstName, surname, matricNo, result[0].hash, { from: this.state.account }).then((r) => {
      return this.setState({ ipfsHash: result[0].hash })
      console.log('ifpsHash has been stored to Blockchain', this.state.ipfsHash)
    })
    */
      

      //----- get hash
      
      /*
      var json = require('./SimpleStorage.json');
    
      const contract = require('truffle-contract')
      const simpleStorage = contract(json)

      const web3 = new Web3(window.web3.currentProvider);
    
      simpleStorage.setProvider(web3.currentProvider);


      web3.eth.getAccounts((error, accounts) => {
        simpleStorage.deployed().then((instance) => {
          this.simpleStorageInstance = instance
          this.setState({ account: accounts[0] })
          // Get the value from the contract to prove it worked.
          return this.simpleStorageInstance.get.call("Oyinkansola", "Ifarajimi", "PHI/2015/014")
        }).then((ipfsHash) => {
          // Update state with the result.
          console.log('result gotten', ipfsHash);
          return this.setState({ ipfsHash })
        })
      })
      */



  }


  render() {
    return (

      <div className="App">
        
        <div class="header">
                <img src={logo} />
                <h1>University of Abuja Certificate Verifier</h1>
                <p>Verify Candidate Certificates Stored Securely On The Blockchain.</p>
              </div>
              <br></br>
              

              <Tabs class="tab">
                <TabList>
                  <Tab>Verify Certificate</Tab>
                  <Tab>Upload Certificate</Tab>
                </TabList>
           
                <TabPanel>
                  

                  
                  <br></br>
                  <body class="centered-wrapper">

                    The University of Abuja, a leader in blockchain technology education, offers an open source platform to issue and verify digital certificates in a completely decentralized way; 
                    i.e. with no dependencies to the issuing institution or anyone else other than Bitcoin's blockchain. This site is a front-end of the open source verification software that anyone
                    can use to validate digital certificates. All graduates, in addition to getting a physical diploma, also get a PDF copy of the diploma with special metadata that anchors that certificate 
                    into the blockchain.
                    <br></br>
                    <br></br>
                    Please note that the actual PDF of the certificate itself is published to the blockchain, and a fingerprint of the PDF, which is enough to validate that the exact document is also
                    saved to the blockchain.

                    <h1><u>Upload a certificate to verify</u></h1>
                    1. Enter the student's Firstname, Surnname and Matriculation number.                    
                    <br></br> 
                    2. Select the pdf file containing the certificate you want to verify.
                    <br></br> 
                    3. Click submit.
                    <br></br> 
                    4. Wait for a confirmation message.
                    <br></br> 

                  </body>
                  
                  <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>

                  <br></br>
                  <br></br>
                  <form class = "form" onSubmit={this.onSubmit} >

                    
                    <h class = 'heading'>Firstname</h><br></br>
                    <input class= "input" type="text" id="firstName" placeholder="First name" /><br></br>
                    <h class = 'heading'>Surname</h><br></br>
                    <input class= "input" type="text" id="surname" placeholder="Surname"/><br></br>
                    <h class = 'heading' >Matriculation Number</h><br></br>
                    <input class= "input" type="text" id="matricNo" placeholder="Matric Number"/><br></br>
                    <br></br>
                    <input class = "choose" type='file' id = 'choose' onChange={this.captureFile}/><br></br>
                    <input class = "button" type='submit' id = 'submit' />

                  </form>

                  <br></br>
                  <br></br>
                  
                </TabPanel>

                <TabPanel>
                  <p>With administrator access, you can upload a student certificate to the Blockchain</p>

                </TabPanel>
              </Tabs>


          
      </div>
    );

  }
}

export default App;
