const { ethers } = require("hardhat");
const { expect } = require("chai");

const toWei = (num) => ethers.utils.parseEther(num);
const toEther = (num) => ethers.utils.parseUnits(num.toString(), "ether");

describe("BUY ME A COFFEE", () => {
  let Contract, contract;
  let tip, amount;
  let deployer, tipper, tipper2;

  beforeEach("Deployment", async () => {
    [deployer, tipper, tipper2] = await ethers.getSigners();
    Contract = await ethers.getContractFactory("BuyMeACoffee");
    contract = await Contract.deploy();
    await contract.deployed();

    tip = await contract.getTipAmount();
    tip = tip.toString();
  });

  it("Tips owner", async () => {
    amount = tip;

    await contract.connect(tipper).tipMe("I just tipped you", {
      value: amount,
    });
    await contract.connect(tipper).tipMe("I just tipped you now", {
      value: amount,
    });
    await contract.connect(tipper2).tipMe("I just tipped you again", {
      value: amount,
    });
    await contract.connect(tipper2).tipMe("I just tipped you again and again", {
      value: amount,
    });

    expect(tip).to.equal(toEther(0.01));

    expect(await contract.getTipCount()).to.equal(4);
    console.log("count:", (await contract.getTipCount()).toString());

    expect(await contract.owner()).to.equal(deployer.address);

    const notes = await contract.getAllNotes();

    const result = await Promise.all(
      notes.map((note) => ({
        from: note.from,
        to: note.to,
        message: note.message,
        tipAmount: note.amount.toString(),
        timestamp: new Date(note.timestamp.toNumber() * 1000).toLocaleString(),
      }))
    );
    console.log("Result: ", result);
  });

  it("Gets owner balance", async () => {
    await contract.withdrawEth();

    console.log((await deployer.getBalance()).toString());
  });
});
