pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  string storedData;


  struct studentInfo{
        string firstName;
        string lastName;
        string matricNo;
        string ipfsHash;
    }
    
  mapping (string => studentInfo) AllStudents;
    

  function set(string memory _firstName, string memory _lastName, string memory _matricNo, string memory _ipfsHash) public {
        AllStudents[_firstName].lastName = _lastName;
        AllStudents[_firstName].matricNo = _matricNo;
        AllStudents[_firstName].ipfsHash = _ipfsHash;
  }

  function get(string memory _firstName, string memory _lastName, string memory _matricNo) public view returns (string memory) {

    if (    keccak256(abi.encodePacked( AllStudents[_firstName].lastName )) == keccak256(abi.encodePacked( _lastName )) &&  
      keccak256(abi.encodePacked( AllStudents[_firstName].matricNo )) == keccak256(abi.encodePacked( _matricNo ))          ) {
        return AllStudents[_firstName].ipfsHash;
    }else{
      return "Not found";
    }
    
  }

    function SetStudentInfo(string memory _firstName, string memory _lastName, string memory _matricNo, string memory _ipfsHash) public{
        AllStudents[_firstName].lastName = _lastName;
        AllStudents[_firstName].matricNo = _matricNo;
        AllStudents[_firstName].ipfsHash = _ipfsHash;
    }
    
    function GetStudentInfo(string memory _firstName, string memory _lastName, string memory _matricNo) public view returns(string memory){

    	
    	if (keccak256(bytes(AllStudents[_firstName].lastName)) == keccak256(bytes(_lastName)) && (keccak256(bytes(AllStudents[_firstName].matricNo)) == keccak256(bytes(_matricNo)))){
    		return AllStudents[_firstName].ipfsHash;
    	}else{
    		return "Invalid certiicate";
    		}
        
    }
}
