pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  string storedData;

  function set(string x) public {
    storedData = x;
  }

  function get() public view returns (string) {
    return storedData;
  }


}
