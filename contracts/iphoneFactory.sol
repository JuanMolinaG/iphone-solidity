pragma solidity >=0.5.0 <0.6.0;

contract IphoneFactory {

  event NewIphone(uint iphoneId, uint style);

  uint styleDigits = 16;
  uint styleModulus = 10 ** styleDigits;
  
  struct Iphone {
    uint style;
  }

  Iphone[] public iphones;

  mapping (uint => address) iphoneToOwner;
  mapping (address => uint) ownerIphoneCount;

  function _createIphone(uint _style) internal {
    uint id = iphones.push(Iphone(_style)) - 1;
    iphoneToOwner[id] = msg.sender;
    ownerIphoneCount[msg.sender]++;
    emit NewIphone(id, _style);
  }

  function _generateRandomStyle(string memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % styleModulus;
  }

  function createRandomIphone(string memory _randStr) public {
    require(ownerIphoneCount[msg.sender] == 0, "You already created an Iphone!");
    uint randStyle = _generateRandomStyle(_randStr);
    _createIphone(randStyle);
  }
}
