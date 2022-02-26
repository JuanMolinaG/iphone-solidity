const IphoneSolidity = artifacts.require("IphoneSolidity");
const helpers = require("./utils/helpers");
const expect = require('chai').expect;

const iphoneCaseNames = ["Iphone case 1", "Iphone case 2", "Iphone case 3"];

contract("IphoneSolidity", (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await IphoneSolidity.new();
  });
  it("should be able to create a new Iphone", async () => {
    const result = await contractInstance.createRandomIphone(iphoneCaseNames[0], {from: alice});
    // assert.equal(result.receipt.status, true); // using default module
    expect(result.receipt.status).to.equal(true); // using chai module
    // assert.equal(result.logs[0].args.caseName, iphoneCaseNames[0]);
    expect(result.logs[0].args.caseName).to.equal(iphoneCaseNames[0]);
  });
  it("should not allow create two Iphones to same user", async () => {
    await contractInstance.createRandomIphone(iphoneCaseNames[0], {from: alice});
    await helpers.shouldThrow(contractInstance.createRandomIphone(iphoneCaseNames[1], {from: alice}));
  });
});