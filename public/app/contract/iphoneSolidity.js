const iphoneSolidityABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getIphonesByOwner",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "iphones",
    "outputs": [
      {
        "name": "style",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "deleteIphonesFromOwner",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_randStr",
        "type": "string"
      }
    ],
    "name": "createRandomIphone",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_iphoneId",
        "type": "uint256"
      },
      {
        "name": "_targetStyle",
        "type": "uint256"
      }
    ],
    "name": "fuseWithIphone",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "IphonesDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "iphoneId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "style",
        "type": "uint256"
      }
    ],
    "name": "NewIphone",
    "type": "event"
  }
];
