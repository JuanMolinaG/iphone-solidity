pragma solidity >=0.5.0 <0.6.0;

import "./../iphoneFusing.sol";

contract Helper is IphoneFusing {
  function getIphonesByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerIphoneCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < iphones.length; i++) {
      if (iphoneToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }
}