import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs';
import TruffleContract from './truffle-config';
import Web3 from 'web3';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import logo from './logo.png'; 
import success from './success.png'
import successUpload from './successUpload.png'
import failure from './failure.png'
import download from './download.png'
import { render } from 'react-dom';
import * as $ from 'jquery'
import ScriptTag from 'react-script-tag';
import InnerHTML from 'dangerously-set-html-content'



import "./App.css";
import html from './test.html';
import html2 from './verifyFingerprint.html';
var htmlDoc = {__html: html};
var fingerprintHTML = {__html: html2};


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


    const myelement = <App brand="Ford" />;

    this.state = {
      storageValue: 0, 
      ipfsHash : '',
      web3: null,
      buffer: null,
      fingerprintBuffer: null,
      account: null
    }
  
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.uploadCertificate = this.uploadCertificate.bind(this);
    this.uploadQR = this.uploadQR.bind(this);
    this.convertFingerPrintBuffer = this.convertFingerPrintBuffer.bind(this);
    this.verifyCertificateFingerPrint = this.verifyCertificateFingerPrint.bind(this);

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

  convertFingerPrintBuffer(event){
    this.state.fingerprintBuffer =  new Buffer(window.fingerPrintImage, 'binary').toString('base64')
  }

  verifyCertificateFingerPrint(event){
    event.preventDefault()
    var matricNo = document.getElementById('matricNo').value
    
    if(matricNo.length==0){
      alert("Matriculation Number cannot be empty");
      document.getElementById('firstName').innerHTML = "Firstname cannot be empty";
    }
    else if(window.fingerPrintImage.length == 0){
      alert("Please repeat fingerprint capturing");
      document.getElementById('matricNo').innerHTML = "Matriculation Number cannot be empty";
    }
    else if(window.f1Score < 50){
      alert("Faint thumb printing image, Please repeat fingerprint capturing");
      document.getElementById('matricNo').innerHTML = "Matriculation Number cannot be empty";
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

  uploadQR(event){
    event.preventDefault()

    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        alert("Upload Unsuccessful");
        return
      }

      console.log('this is my result', result[0].hash)

      const Http = new XMLHttpRequest();
      const urlImage = 'https://ipfs.io/ipfs/' + result[0].hash
      const url ='https://api.qrserver.com/v1/read-qr-code/?fileurl=' + urlImage;

      Http.open("GET", url);
      Http.send();


      Http.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
        if(Http.readyState === XMLHttpRequest.DONE) {
          if (Http.responseText.split('"error":').pop().includes("null")){
            console.log('QRCODE type', Http.responseText)

            var mySubString = Http.responseText.substring(
              Http.responseText.lastIndexOf(":") + 1, 
              Http.responseText.lastIndexOf("\"") + 2
            );

            var url = Http.responseText.substring(Http.responseText.lastIndexOf('\"data\":\"')+8,Http.responseText.lastIndexOf('\",\"error\"'))
            
            window.open("https://ipfs.io/ipfs/"+url,"_self")


          }else{
            alert("invalid QR CODE");
            return
          }
        }
      }
      

      

      return this.setState({ ipfsHash: result[0].hash })
    })




  }


  uploadCertificate(event) {

    
    console.log("this is the fingerprintImage", window.fingerPrintImage);

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
    }
    /*
    else if(window.fingerPrintImage.length == 0){
      alert("Please repeat fingerprint capturing");
      document.getElementById('matricNo').innerHTML = "Matriculation Number cannot be empty";
    }
    */
    /*
    else if(window.f1Score < 50){
      alert("Faint thumb printing image, Please repeat fingerprint capturing");
      document.getElementById('matricNo').innerHTML = "Matriculation Number cannot be empty";
    }
    */

    

    else{
            


      
      console.log('upload...')

      //-----set
      ipfs.files.add(this.state.buffer, (error, result) => {
        if(error) {
          console.error(error)
          alert("Upload Unsuccessful");
          return
        }
        ipfs.files.add(this.state.fingerprintBuffer, (error, resultFingerPrint) => {
          if(error) {
            console.error(error)
            alert("Upload Unsuccessful");
            return
          }

          this.simpleStorageInstance.setFingerPrint(matricNo, resultFingerPrint[0].hash, { from: this.state.account }).then((r) => {

          })

          this.simpleStorageInstance.set(firstName, surname, matricNo, result[0].hash, { from: this.state.account }).then((r) => {
            

            var img = document.getElementById("success2");
            img.style.visibility = "visible";
            document.getElementById("success2").style.display = "block";
            img.style.height = '300px'
            img.style.width = '300px'

            img.src="https://api.qrserver.com/v1/create-qr-code/?data=" + result[0].hash + "&amp;size=300x300";


            //switch off forms
            var formFirstName = document.getElementById("firstName2");
            var formSurnName = document.getElementById("surname2");
            var formMatricNo = document.getElementById("matricNo2");
            var uploadButton = document.getElementById("upload");

            var header1 = document.getElementById("header1");
            var header2 = document.getElementById("header2");
            var header3 = document.getElementById("header3");

            var downloadQR = document.getElementById("downloadQR");
            var successHeading = document.getElementById("successHeading");



            formFirstName.style.visibility = "hidden";
            formSurnName.style.visibility = "hidden";
            formMatricNo.style.visibility = "hidden";
            
            header1.style.visibility = "hidden";
            header2.style.visibility = "hidden";
            header3.style.visibility = "hidden";

            document.getElementById("choose").style.visibility= "hidden";
            document.getElementById("upload").style.visibility= "hidden";

            //show download QRCODE button
            document.getElementById("downloadQR").href="https://api.qrserver.com/v1/create-qr-code/?data=" + result[0].hash + "&amp;size=300x300";
            document.getElementById("downloadQR").style.visibility= "visible";
            document.getElementById("successHeading").style.visibility= "visible";



            console.log('ifpsHash', result[0].hash)
            return this.setState({ ipfsHash: result[0].hash })
          
          })
        
        })
      })

      



      
      
    }

  }


  render() {

    return (

      <div class="App">
        
        <div class="header">
                <img src={logo} />
                <h1>Nigerian Tulip International Colleges</h1>
                <p>Verify Candidate Certificates Stored Securely On The Blockchain.</p>
              </div>
              <br/>
              

              <Tabs class="tab">
                <TabList>
                  <Tab>Authenticate Certificate</Tab>
                  <Tab>QRCODE Authentication</Tab>
                  <Tab>Fingerprint Authentication</Tab>
                  <Tab>Upload Certificate</Tab>
                </TabList> 
           
                <TabPanel>
                  

                  
                  <br/>
                  <div class="centered-wrapper">

                    Nigerian Tulip International Colleges, a leader in blockchain technology education, offers an open source platform to issue and verify digital certificates in a completely decentralized way; 
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

                  </div>
                  
                  

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
                <p>Upload the QRCODE to Authenticate the certificate</p>
                <br/>
                <br/>
                <form class = "form" onSubmit={this.uploadQR} >

                  <div class="container">
                    <div class="center">

                      <img class= 'certificateQR' id = 'certificate_result' alt=""/>

                      <input class = "chooseQR" type='file' id = 'choose' onChange={this.captureFile}/><br/>
                      
                      <input class = "buttonQRCODE" type='submit' id = 'upload' value='VERIFY' onClick={this.uploadQR} />


                    </div>
                  </div>


                  

                </form>

                </TabPanel>
                

                <TabPanel>
                  <p>Enter Students Matriculation Number and Fingerprint to verify certificate</p>

                  <h class = 'heading' id="header3">Matriculation Number</h> <br/> 
                    <br/><br/><input class= "input" type="text" id="matricNo2" placeholder="Student's Matric Number"/><br/><br/>

                    <br/><br/>

                     <div class="panel-body">
                        <form>
                           
                           <div class="col-sm-1">
                              <div class="col-sm-2">
                                 <div class="box" id="box2"></div>
                                  <label id = "f2score"> </label>
                                  <button for="box2" type="button" class="capture" id="capture">Capture</button>
                              </div>
                                
                           </div>
                        </form>
                     </div>


                    
                    <input class = "compare" type='submit' id = 'upload' value='Verify'/>       
                </TabPanel>
                

                <TabPanel>
                  <p>Please note you will require administrator access to upload a student certificate</p>
                  <br/>
                  <br/>
                  <form class = "form" onSubmit={this.onSubmit} >
                    <div>
                      <img class= 'upload' id = 'success2' alt=""/>
                    </div>

                    <div>
                      <a href="path_to_file" class = "downloadQR" id="downloadQR" download="proposed_file_name">Download QRCODE</a>
                    </div>

                    <div>
                      <h class = 'successHeading' id="successHeading">Upload Successful</h><br/>
                    </div>
                    
                    
                    


                    <h class = 'heading' id="header1">Student's Firstname</h><br/>
                    <input class= "input" type="text" id="firstName2" placeholder="Student's Firstname" /><br/>
                    <h class = 'heading' id="header2" >Student's Surname</h><br/>
                    <input class= "input" type="text" id="surname2" placeholder="Student's Surname"/><br/>
                    <h class = 'heading' id="header3">Matriculation Number</h><br/>
                    <input class= "input" type="text" id="matricNo2" placeholder="Student's Matric Number"/><br/><br/>
                    <input class = "choose" type='file' id = 'choose' onChange={this.captureFile}/><br/>
                    <h class = 'heading' id="header3">Students Fingerprint</h><br/>
                    
                    
                    
                      <div class="col-sm-1 animated fadeIn">
                      
                         <div class="panel-body">
                            <form>
                               
                               <div class="col-sm-1">
                                  <div class="col-sm-2">
                                     <div class="box" id="box1"></div>
                                      <label class="labelscore" id = "f1score"> </label>
                                      <button for="box1" type="button" class="capture" id="capture">Capture</button>
                                    
                                    
                               </div>
                                  </div>
                            </form>
                            </div>
                         
                      </div>

                    
                    <input class = "button_upload" type='submit' id = 'upload' value='Upload Certificate' onClick={this.uploadCertificate} />


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