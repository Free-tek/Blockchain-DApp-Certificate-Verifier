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
import success from './success.png'
import successUpload from './successUpload.png'
import failure from './failure.png'
import download from './download.png'

import "./App.css";

class App extends Component {

  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  async componentDidMount(){

    // Get network provider and web3 instance.
    
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
    this.uploadCertificate = this.uploadCertificate.bind(this);
  }



  instantiateContract() {

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
          return this.simpleStorageInstance.get.call(firstName, surname, matricNo)
        }).then((ipfsHash) => {
          // Update state with the result.
          console.log("ipfsHash", ipfsHash)
          this.setState({ ipfsHash })


          if(this.state.ipfsHash == 'Not found'){
            var img3 = document.getElementById("success");
            img3.style.visibility = "hidden";
            var img = document.getElementById("failure");
            img.style.visibility = "visible";
            
          }else{
            var img = document.getElementById("failure");
            img.style.visibility = "hidden";
            var img3 = document.getElementById("success");
            img3.style.visibility = "visible";
            var downloadBtn = document.getElementById("download");
            downloadBtn.style.visibility = "visible";
          }

          return this.setState({ ipfsHash })
        })
      })
      
    
    }


  }


  uploadCertificate(event) {

    event.preventDefault()
    var firstName = document.getElementById('firstName2').value
    var surname = document.getElementById('surname2').value
    var matricNo = document.getElementById('matricNo2').value
    
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
            


      
      console.log('upload...')

      //-----set
      ipfs.files.add(this.state.buffer, (error, result) => {
        if(error) {
          console.error(error)
          alert("Upload Unsuccessful");
          return
        }
        this.simpleStorageInstance.set(firstName, surname, matricNo, result[0].hash, { from: this.state.account }).then((r) => {
          var img = document.getElementById("success2");
          img.style.visibility = "visible";
          console.log('ifpsHash', result[0].hash)
          return this.setState({ ipfsHash: result[0].hash })
          
        })
      })
      
    }

  }


  render() {
    return (

      <div className="App">
        
        <div class="header">
                <img src={logo} />
                <h1>University of Abuja Certificate Verifier</h1>
                <p>Verify Candidate Certificates Stored Securely On The Blockchain.</p>
              </div>
              <br/>
              

              <Tabs class="tab">
                <TabList>
                  <Tab>Authenticate Certificate</Tab>
                  <Tab>Upload Certificate</Tab>
                </TabList>
           
                <TabPanel>
                  

                  
                  <br/>
                  <body class="centered-wrapper">

                    The University of Abuja, a leader in blockchain technology education, offers an open source platform to issue and verify digital certificates in a completely decentralized way; 
                    i.e. with no dependencies to the issuing institution or anyone else other than Bitcoin's blockchain. This site is a front-end of the open source verification software that anyone
                    can use to validate digital certificates. All graduates, in addition to getting a physical diploma, also get a PDF copy of the diploma with special metadata that anchors that certificate 
                    into the blockchain.
                    <br/>
                    <br/>
                    Please note that the actual PDF of the certificate itself is published to the blockchain, and a fingerprint of the PDF, which is enough to validate that the exact document is also
                    saved to the blockchain.

                    <h1><u>Authenticate a certificate </u></h1>
                    1. Enter the student's Firstname, Surname and Matriculation number.                    
                    <br/> 
                    2. Click submit.
                    <br/> 
                    3. Wait for a confirmation message, you would also get a link to download the original certificate
                    <br/> 

                  </body>
                  
                  

                  <br/>
                  <br/>
                  <form class = "form" onSubmit={this.onSubmit} >
                    <img class= 'success' src={success} id = 'success' alt=""/>
                    <img class= 'failure' src={failure} id = 'failure' alt=""/>
                    <br/>
                    <a href={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} download>
                      <img class="download" id="download" src={download} alt="download"/>
                    </a>
                    <br/><br/><br/>

                    <h class = 'heading'>Firstname</h><br/>
                    <input class= "input" type="text" id="firstName" placeholder="Firstname" /><br/>
                    <h class = 'heading'>Surname</h><br/>
                    <input class= "input" type="text" id="surname" placeholder="Surname"/><br/>
                    <h class = 'heading' >Matriculation Number</h><br/>
                    <input class= "input" type="text" id="matricNo" placeholder="Matric Number"/>
                    <br/>
                    <br/>
                    <input class = "button" type='submit' id = 'submit' />
                    <br/>
                  </form>

                  <br/>
                  <br/>
                  
                </TabPanel>

                <TabPanel>
                  <p>Please note you will require administrator access to upload a student certificate</p>
                  <br/>
                  <br/>
                  <form class = "form" onSubmit={this.onSubmit} >

                    <img class= 'upload' src={successUpload} id = 'success2' alt=""/>
                    <br/>
                    <br/>
                    <br/>
                    <h class = 'heading'>Student's Firstname</h><br/>
                    <input class= "input" type="text" id="firstName2" placeholder="Student's Firstname" /><br/>
                    <h class = 'heading'>Student's Surname</h><br/>
                    <input class= "input" type="text" id="surname2" placeholder="Student's Surname"/><br/>
                    <h class = 'heading' >Matriculation Number</h><br/>
                    <input class= "input" type="text" id="matricNo2" placeholder="Student's Matric Number"/><br/><br/>
                    <input class = "choose" type='file' id = 'choose' onChange={this.captureFile}/><br/>
                    <br/>
                    <input class = "button" type='submit' id = 'upload' value='Upload Certificate' onClick={this.uploadCertificate} />
                    <br/>
                    <br/>
                  </form>
                  <br/>
                  <br/>

                </TabPanel>
              </Tabs>


          
      </div>
    );

  }
}

export default App;
