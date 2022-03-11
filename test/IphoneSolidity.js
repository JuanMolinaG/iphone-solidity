const IphoneSolidity = artifacts.require("IphoneSolidity");
const helper = require("./utils/helper");
const expect = require('chai').expect;

const iphoneCaseNames = ["Iphone case 1", "Iphone case 2", "Iphone case 3"];

contract("IphoneSolidity", (accounts) => {
  let [alice] = accounts;
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await IphoneSolidity.new();
  });
  it("should be able to create a new Iphone", async () => {
    const result = await contractInstance.createRandomIphone('test', {from: alice});
    // assert.equal(result.receipt.status, true); // using default module
    expect(result.receipt.status).to.equal(true); // using chai module
    expect(result.logs[0].event).to.equal('NewIphone');
  });
  it("should not allow create two Iphones to same user", async () => {
    await contractInstance.createRandomIphone('test', {from: alice});
    await helper.shouldThrow(contractInstance.createRandomIphone('test2', {from: alice}));
  });
  it("should return the user Iphones", async () => {
    await contractInstance.createRandomIphone('test', {from: alice});
    await contractInstance.fuseWithIphone(0, 8184682657981552, {from: alice});
    const result = await contractInstance.getIphonesByOwner(alice);
    expect(result.toString()).to.equal('0,1')
  });
  it("should not return any Iphone", async () => {
    await contractInstance.createRandomIphone('test', {from: alice});
    await contractInstance.fuseWithIphone(0, 8184682657981552, {from: alice});
    await contractInstance.deleteIphonesFromOwner(alice);
    const result = await contractInstance.getIphonesByOwner(alice);
    expect(result.toString()).to.equal('');
  });
});