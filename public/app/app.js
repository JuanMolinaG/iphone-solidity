let iphoneSolidityContract;
let userAccount;

const loginButton = document.querySelector('.metamask_login');
const proceedFuseButton = document.querySelector('.to_fuse__proceed');

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
  // const iphoneSolidityAddress = '0xcda2bC4e9e336924df35EECaF3c7BC74501DacDE';
  const iphoneSolidityAddress = '0xfEc601eE420854C4DE949Edd09a88c7A8f05CD76';
  iphoneSolidityContract = new web3.eth.Contract(iphoneSolidityABI, iphoneSolidityAddress);
  iphoneSolidityContract.setProvider(web3.currentProvider);
  getIphonesByOwner(userAccount).then(handleIphones);
}
function handleIphones(ids) {
  if (ids.length === 0) {
    showCreateIphone();
  } else {
    document.querySelector('.login').classList.add('hidden');
    document.querySelector('.user_iphones').classList.remove('hidden');
    displayIphones(ids);
    generateIphonesToFuse();
  }
}
function showCreateIphone() {
  document.querySelector('.login').classList.add('hidden');
  document.querySelector('.no_iphone').classList.remove('hidden');

  document.querySelector('.create_iphone').addEventListener('click', () => {
    createRandomIphone('test');
  });
}
async function displayIphones(ids) {
  for (id of ids) {
    let iphoneDetails = await getIphoneDetails(id);
    document.querySelector('.user_iphones').insertAdjacentHTML('beforeend', printIphone(id, iphoneDetails.style))
  }
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
  document.querySelector('.to_fuse').classList.remove('hidden');
  proceedFuseButton.addEventListener('click', () => {
    fuseIphones();
  });
  for (let i = 0; i < 3; i++) {
    const style = generateRandomStyle();
    document.querySelector('.to_fuse').insertAdjacentHTML('beforeend', printIphone(i, style));
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
  console.log("Creating new Iphone on the blockchain. This may take a while...");
  return iphoneSolidityContract.methods.createRandomIphone(name)
  .send({ from: userAccount })
  .on("receipt", function(receipt) {
    console.log("Successfully created!");
    document.querySelector('.no_iphone').display = 'none';
    getIphonesByOwner(userAccount).then(displayIphones);
  })
  .on("error", function(error) {
    console.log(error);
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
    console.log("Fusing Iphones. This may take a while...");
    return iphoneSolidityContract.methods.fuseWithIphone(userIphoneStyle, targetStyle)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      console.log("Iphones fused. You got a new Iphone!");
      getIphonesByOwner(userAccount).then(displayIphones);
    })
    .on("error", function(error) {
      console.log(error);
    });
}
