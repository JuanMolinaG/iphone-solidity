pragma solidity >=0.5.0 <0.6.0;

import "./utils/ownable.sol";

contract IphoneFactory is Ownable{

  event NewIphone(uint iphoneId, string caseName, uint style);

  uint styleDigits = 16;
  uint styleModulus = 10 ** styleDigits;
  
  struct Iphone {
    string caseName;
    uint style;
  }

  Iphone[] public iphones;

  mapping (uint => address) iphoneToOwner;
  mapping (address => uint) ownerIphoneCount;

  function _createIphone(string memory _caseName, uint _style) internal {
    uint id = iphones.push(Iphone(_caseName, _style)) - 1;
    iphoneToOwner[id] = msg.sender;
    ownerIphoneCount[msg.sender]++;
    emit NewIphone(id, _caseName, _style);
  }

  function _generateRandomStyle(string memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % styleModulus;
  }

  function createRandomIphone(string memory _name) public {
    require(ownerIphoneCount[msg.sender] == 0, "You already created an Iphone!");
    uint randStyle = _generateRandomStyle(_name);
    _createIphone(_name, randStyle);
  }
}
