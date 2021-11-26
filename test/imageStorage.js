const ImageStorage = artifacts.require("./ImageStorage.sol");

const truffleAssert = require('truffle-assertions');

contract("ImageStorage", accounts => {

  it("....should deploy smart contract properly", async() =>{
    const ImageStorageInstance = await ImageStorage.deployed();

    assert(ImageStorageInstance.address != ' ');
  })

  it("....should add first account as owner using OpenZeppelin Ownable", async () => {
    const ImageStorageInstance = await ImageStorage.deployed();

    assert.strictEqual(await ImageStorageInstance.owner(), accounts[0]);

  });

  it("...should increase the value of imageCount",async () => {
    const ImageStorageInstance = await ImageStorage.deployed();

    await ImageStorageInstance.set("Hello World", { from: accounts[0] });

    const storedData = await ImageStorageInstance.imageCount.call();

    assert.equal(storedData, 1, "The value of imageCount should increase");
  })

  it("...should store the value 'Hello World'", async () => {
    const ImageStorageInstance = await ImageStorage.deployed();

    // Set value of images to Hello World
    await ImageStorageInstance.set("Hello World", { from: accounts[0] });

    // Get stored value
    const storedData = await ImageStorageInstance.images.call(1);

    assert.equal(storedData, "Hello World", "The value Hello World was not stored.");
  });

  it("Testing if ImageAdded event is triggered or not", async () => {

    const ImageStorageInstance = await ImageStorage.new();

    const tx = await ImageStorageInstance.set("Hello World", { from: accounts[0] });

    truffleAssert.eventEmitted(tx, 'ImageAdded', (ev) => {
      assert.equal(ev.imageID.toNumber(), 1 , "Incorrect imageCount returned")
      return true;
    }, 'ImageAdded should be emitted with correct parameters');

  })
});
