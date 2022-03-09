let iphoneSolidityContract;
let userAccount;

const loginButton = document.querySelector('.metamask_login');
const proceedFuseButton = document.querySelector('.to_fuse__proceed');
const createIphoneButton = document.querySelector('.create_iphone');

const loginScreen = document.querySelector('.login');
const noIphoneScreen = document.querySelector('.no_iphone');
const userIphonesScreen = document.querySelector('.user_iphones');
const toFuseIphonesScreen = document.querySelector('.to_fuse');
const messagesScreen = document.querySelector('.proccess_messages');

window.addEventListener('load', function() {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(web3.currentProvider);

    loginButton.addEventListener('click', () => {
      loginScreen.classList.add('hidden');
      messagesScreen.classList.remove('hidden');
      messagesScreen.innerText = 'Connecting with MetaMask...'
      getAccount();
    });
  }
});

function getAccount() {
  ethereum.request({ method: 'eth_requestAccounts' })
    .then(accounts => {
      userAccount = accounts[0];
      startApp();
    })
    .catch(error => {
      messagesScreen.classList.add('hidden');
      loginScreen.classList.remove('hidden');
      console.error(error);
    });
}
function startApp() {
  messagesScreen.innerText = 'Getting user Iphones...';
  const iphoneSolidityAddress = '0xfEc601eE420854C4DE949Edd09a88c7A8f05CD76';
  iphoneSolidityContract = new web3.eth.Contract(iphoneSolidityABI, iphoneSolidityAddress);
  iphoneSolidityContract.setProvider(web3.currentProvider);
  getIphonesByOwner(userAccount).then(handleIphones);
}
function handleIphones(ids) {
  if (ids.length === 0) {
    showCreateIphone();
  } else {
    displayIphones(ids);
  }
}
function showCreateIphone() {
  messagesScreen.classList.add('hidden');
  noIphoneScreen.classList.remove('hidden');

  createIphoneButton.addEventListener('click', () => {
    createRandomIphone('test'); // TODO: Remove caseName from Contract
  });
}
async function displayIphones(ids) {
  document.querySelectorAll('.user_iphones .iphone')?.forEach(el => el.parentElement.remove());
  for (id of ids) {
    let iphoneDetails = await getIphoneDetails(id);
    userIphonesScreen.insertAdjacentHTML('beforeend', printIphone(id, iphoneDetails.style))
  }
  messagesScreen.classList.add('hidden');
  userIphonesScreen.classList.remove('hidden');
  generateIphonesToFuse();
  makeUserIphonesSelectable();
}
function printIphone(id, style) {
  const color1 = decimalToColor(style.substring(0, 7)),
        color2 = decimalToColor(style.substring(2, 11)),
        color3 = decimalToColor(style.substring(6, 14)),
        color4 = decimalToColor(style.substring(8, 17));

  const iphoneHtml = `
    <div class="iphone_container">
      <div class="iphone" data-iphone-id="${id}" data-iphone-style="${style}" style="background-image: linear-gradient(160deg, ${color1} 0%, ${color2} 100%); border-color: ${color3};">
        <div class="iphone__camera" style="background-color: ${color4}">
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
            <img src="./images/mac-os.png"/>
        </div>
        <div class="iphone__power-button"></div>
        <div class="iphone__another-button"></div>
        <div class="iphone__volume-up-button"></div>
        <div class="iphone__voume-down-button"></div>
        <div class="iphone__mark--1"></div>
        <div class="iphone__mark--2"></div>
        <div class="iphone__mark--3"></div>
        <div class="iphone__mark--4"></div>
      </div>
    </div>`;

  return iphoneHtml;
}
function generateIphonesToFuse() {
  document.querySelectorAll('.to_fuse .iphone')?.forEach(el => el.parentElement.remove());
  toFuseIphonesScreen.classList.remove('hidden');
  proceedFuseButton.addEventListener('click', () => {
    fuseIphones();
  });
  for (let i = 0; i < 3; i++) {
    const style = generateRandomStyle();
    toFuseIphonesScreen.insertAdjacentHTML('beforeend', printIphone(i, style));
  }
  makeIphonesToFuseSelectable();
}
function generateRandomStyle() {
  const min = 1000000000000000;
  const max = 9999999999999999;
  const style = Math.floor(Math.random() * (max - min)) + min;
  return style.toString();
}
function makeUserIphonesSelectable() {
  const userIphones = [...document.querySelectorAll('.user_iphones .iphone')];

  userIphones.forEach((iphone) => {
    iphone.addEventListener('click', () => {
      const prevSelected = document.querySelector('.user_iphones .selected .iphone');
      if (prevSelected && (prevSelected !== iphone)) {
        prevSelected.parentElement.classList.remove('selected');
      }
      iphone.parentElement.classList.toggle('selected');
    });
  });
}
function makeIphonesToFuseSelectable() {
  const toFuseIphones = [...document.querySelectorAll('.to_fuse .iphone')];

  toFuseIphones.forEach((iphone) => {
    iphone.addEventListener('click', () => {
      const prevSelected = document.querySelector('.to_fuse .selected .iphone');
      if (prevSelected && (prevSelected !== iphone)) {
        prevSelected.parentElement.classList.remove('selected');
      }
      iphone.parentElement.classList.toggle('selected');
    });
  });
}
function fuseIphones() {
  const userIphoneId = document.querySelector('.user_iphones .selected .iphone')?.getAttribute('data-iphone-id');
  const targetStyle = document.querySelector('.to_fuse .selected .iphone')?.getAttribute('data-iphone-style');
  
  if (!userIphoneId || !targetStyle) {
    document.querySelector('.to_fuse .error_message').classList.remove('hidden');
    setTimeout(() => {
      document.querySelector('.to_fuse .error_message').classList.add('hidden');
    }, 4000);
    return;
  }

  fuseWithIphone(userIphoneId, targetStyle);
}
function decimalToColor(num) {
  return "#" + (num & 0x00FFFFFF).toString(16).padStart(6, '0');
}

// Contract methods
function createRandomIphone(name) {
  messagesScreen.innerText = 'Creating new Iphone on the blockchain. This may take a while...';
  noIphoneScreen.classList.add('hidden');
  messagesScreen.classList.remove('hidden');

  return iphoneSolidityContract.methods.createRandomIphone(name)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      messagesScreen.innerText = 'Successfully created!';
      getIphonesByOwner(userAccount).then(handleIphones);
    })
    .on("error", function(error) {
      messagesScreen.innerText = 'There was an error creating the Iphone, please try again';
      setTimeout(() => {
        messagesScreen.classList.add('hidden');
        noIphoneScreen.classList.remove('hidden');
      }, 3000);
      console.error(error);
    });
}
async function getIphoneDetails(id) {
  return await iphoneSolidityContract.methods.iphones(id).call()
}
function iphoneToOwner(id) {
  return iphoneSolidityContract.methods.iphoneToOwner(id).call()
}
function getIphonesByOwner(owner) {
  return iphoneSolidityContract.methods.getIphonesByOwner(owner).call()
}
function fuseWithIphone(userIphoneStyle, targetStyle) {
  messagesScreen.innerText = 'Fusing Iphones. This may take a while...';
  userIphonesScreen.classList.add('hidden');
  toFuseIphonesScreen.classList.add('hidden');
  messagesScreen.classList.remove('hidden');

  return iphoneSolidityContract.methods.fuseWithIphone(userIphoneStyle, targetStyle)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      messagesScreen.innerText = 'Iphones fused. You got a new Iphone!';
      getIphonesByOwner(userAccount).then(handleIphones);
    })
    .on("error", function(error) {
      messagesScreen.innerText = 'There was an error fusing the Iphones, please try again';
      setTimeout(() => {
        messagesScreen.classList.add('hidden');
        userIphonesScreen.classList.remove('hidden');
        toFuseIphonesScreen.classList.remove('hidden');
      }, 3000);
      console.error(error);
    });
}
