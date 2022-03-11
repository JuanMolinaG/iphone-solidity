const fs = require('fs');
const contract = JSON.parse(fs.readFileSync('./build/contracts/IphoneSolidity.json', 'utf8'));
console.log(JSON.stringify(contract.abi));