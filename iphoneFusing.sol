pragma solidity >=0.5.0 <0.6.0;

import "./iphoneFactory.sol";

contract KittyInterface {
  function getKitty(uint256 _id) external view returns (
    bool isGestating,
    bool isReady,
    uint256 cooldownIndex,
    uint256 nextActionAt,
    uint256 siringWithId,
    uint256 birthTime,
    uint256 matronId,
    uint256 sireId,
    uint256 generation,
    uint256 genes
  );
}

contract IphoneFusing is IphoneFactory{
  address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
  KittyInterface kittyContract = KittyInterface(ckAddress);

  function fuseAndMultiply(uint _iphoneId, uint _targetStyle, string memory _type) public {
    require(msg.sender == iphoneToOwner[_iphoneId], "You are not the owner of the Iphone!");
    Iphone storage myIphone = iphones[_iphoneId];
    _targetStyle = _targetStyle % styleModulus;
    uint newStyle = (myIphone.style + _targetStyle) / 2;
    if (keccak256(abi.encodePacked(_type)) == keccak256(abi.encodePacked("kitty"))) {
      newStyle = newStyle - newStyle % 100 + 99;
    }
    _createIphone("noName", newStyle);
  }

  function fuseWithKitty(uint _iphoneId, uint _kittyId) public {
    uint kittyStyle;
    (,,,,,,,,,kittyStyle) = kittyContract.getKitty(_kittyId);
    fuseAndMultiply(_iphoneId, kittyStyle, "kitty");
  }
}