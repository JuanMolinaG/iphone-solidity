let iphoneSolidityContract;
let userAccount;

const loginButton = document.querySelector('.metamask_login');

window.addEventListener('load', function() {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(web3.currentProvider);

    loginButton.addEventListener('click', () => {
      getAccount();
    });
  }
});

async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  userAccount = accounts[0];
  startApp();
}

function startApp() {
  const iphoneSolidityAddress = '0xcda2bC4e9e336924df35EECaF3c7BC74501DacDE';
  iphoneSolidityContract = new web3.eth.Contract(iphoneSolidityABI, iphoneSolidityAddress);
  iphoneSolidityContract.setProvider(web3.currentProvider);
  getIphonesByOwner(userAccount).then(handleIphones);
}
function handleIphones(ids) {
  if (ids.length === 0) {
    showCreateIphone();
  } else {
    document.querySelector('.login').style.display = 'none';
    displayIphones(ids);
    generateIphonesToFuse();
  }
}
function showCreateIphone() {
  document.querySelector('.login').style.display = 'none';
  document.querySelector('.no_iphone').style.display = 'block';

  document.querySelector('.create_iphone').addEventListener('click', () => {
    createRandomIphone('test');
  });
}
function displayIphones(ids) {
  for (id of ids) {
    getIphoneDetails(id).then(iphone => {
      document.querySelector('.user_iphones').insertAdjacentHTML('beforeend', printIphone(iphone.style));
    })
  }
}
function createRandomIphone(name) {
  console.log("Creating new zombie on the blockchain. This may take a while...");
  return iphoneSolidityContract.methods.createRandomIphone(name)
  .send({ from: userAccount })
  .on("receipt", function(receipt) {
    console.log("Successfully created " + name + "!");
    getIphonesByOwner(userAccount).then(displayIphones);
  })
  .on("error", function(error) {
    console.log(error);
  });
}
function getIphoneDetails(id) {
  return iphoneSolidityContract.methods.iphones(id).call()
}
function iphoneToOwner(id) {
  return iphoneSolidityContract.methods.iphoneToOwner(id).call()
}
function getIphonesByOwner(owner) {
  return iphoneSolidityContract.methods.getIphonesByOwner(owner).call()
}
function printIphone(style) {
  const color1 = style.substring(0, 6),
        color2 = style.substring(3, 9),
        color3 = style.substring(6, 12),
        color4 = style.substring(9, 15);

  const iphoneHtml = `
    <div class="iphone" data-iphone-id="${style}" style="background-image: linear-gradient(160deg, #${color1} 0%, #${color2} 100%); border-color: #${color3};">
      <div class="iphone__camera" style="background-color: #${color4}">
          <div class="iphone__camera--cam-1">
              <div class="camera__lens"></div>
          </div>
          <div class="iphone__camera--cam-2">
              <div class="camera__lens"></div>
          </div>
          <div class="iphone__camera--flash"></div>
          <div class="iphone__camera--led"></div>
      </div>
      <div class="iphone__image">
          <img src="https://img.icons8.com/metro/208/000000/mac-os.png"/>
      </div>
      <div class="iphone__power-button"></div>
      <div class="iphone__another-button"></div>
      <div class="iphone__volume-up-button"></div>
      <div class="iphone__voume-down-button"></div>
      <div class="iphone__mark--1"></div>
      <div class="iphone__mark--2"></div>
      <div class="iphone__mark--3"></div>
      <div class="iphone__mark--4"></div>
    </div>`;

  return iphoneHtml;
}
function generateIphonesToFuse() {
  for (let i = 0; i < 3; i++) {
    const style = generateRandomStyle();
    document.querySelector('.to_fuse').insertAdjacentHTML('beforeend', printIphone(style));
  }
}
function generateRandomStyle() {
  const min = 1000000000000000;
  const max = 9999999999999999;
  const style = Math.floor(Math.random() * (max - min)) + min;
  return style.toString();
}
