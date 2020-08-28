pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  string storedData;


  struct studentInfo{
        string firstName;
        string lastName;
        string matricNo;
        string ipfsHash;
        string ipfsHashFingerprint;
  }

  struct studentInfoFingerPrint{
        string matricNo;
        string ipfsHash;
        string ipfsHashFingerprint;
  }
    
  mapping (string => studentInfo) AllStudents;

   mapping (string => studentInfoFingerPrint) AllStudentsFingerPrint;
    

  function set(string memory _firstName, string memory _lastName, string memory _matricNo, string memory _ipfsHash, string memory _ipfsHashFingerprint) public {
        AllStudents[_firstName].lastName = _lastName;
        AllStudents[_firstName].matricNo = _matricNo;
        AllStudents[_firstName].ipfsHash = _ipfsHash;
        AllStudents[_firstName].ipfsHashFingerprint = _ipfsHashFingerprint;
  }

  function get(string memory _firstName, string memory _lastName, string memory _matricNo) public view returns (string memory) {

    if (    keccak256(abi.encodePacked( AllStudents[_firstName].lastName )) == keccak256(abi.encodePacked( _lastName )) &&  
      keccak256(abi.encodePacked( AllStudents[_firstName].matricNo )) == keccak256(abi.encodePacked( _matricNo ))          ) {
        return AllStudents[_firstName].ipfsHash;
    }else{
      return "Not found";
    }
    
  }

  function setFingerPrint(string memory _matricNo, string memory _ipfsHash, string memory _ipfsHashFingerprint) public {
    AllStudentsFingerPrint[_matricNo].ipfsHash = _ipfsHash;
    AllStudentsFingerPrint[_matricNo].ipfsHashFingerprint = _ipfsHashFingerprint;
  }

  function getFingerPrint(string memory _matricNo) public view returns (string memory) {

    return AllStudentsFingerPrint[_matricNo].ipfsHashFingerprint;
    
  }

    
}
