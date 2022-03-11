pragma solidity >=0.5.0 <0.6.0;

import "./iphoneFactory.sol";

contract IphoneFusing is IphoneFactory{
  function fuseAndMultiply(uint _iphoneId, uint _targetStyle) internal {
    require(msg.sender == iphoneToOwner[_iphoneId], "You are not the owner of the Iphone!");
    Iphone storage myIphone = iphones[_iphoneId];
    _targetStyle = _targetStyle % styleModulus;
    uint newStyle = (myIphone.style + _targetStyle) / 2;

    _createIphone(newStyle);
  }

  function fuseWithIphone(uint _iphoneId, uint _targetStyle) public {
    fuseAndMultiply(_iphoneId, _targetStyle);
  }
}