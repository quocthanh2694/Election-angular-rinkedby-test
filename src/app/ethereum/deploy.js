
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const ganache = require('ganache-cli');

// process file
const path = require('path');
const fs = require('fs-extra');

const electionContract = require('./build/Election.json');

console.log('Your pass: ', process.env.PASSWORD, '\nYour infura link: ',process.env.INFURA_LINK );

const provider = new HDWalletProvider(
    process.env.PASSWORD,
    process.env.INFURA_LINK
);
const web3 = new Web3(provider);

// const web3 = new Web3(ganache.provider());

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account::: ', accounts[0]);

    const _interface = JSON.parse(electionContract.interface)
    const bytecode = electionContract.bytecode;

    const result = await new web3.eth.Contract(_interface)
        .deploy({ data: '0x' + bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    console.log('Contract deploy to:::: ', result.options.address);


    /////// write to deploy/{addressDeployedFilename}
    try {
        const addressDeployedFilename = 'addressDeployed.json';
        const deployPath = path.resolve(__dirname, 'deploy');
        fs.removeSync(deployPath);
        fs.ensureDirSync(deployPath);
        fs.outputJsonSync(
            path.resolve(deployPath, addressDeployedFilename),
            { address: result.options.address }
        );
        console.log('Deploy completed!!! \nPress Ctrl+C to exit.');
    } catch (err) {
        console.log(err);
    }

}
deploy();