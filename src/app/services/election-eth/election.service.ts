import { Injectable } from '@angular/core';
import { Web3Service } from '../web3/web3.service';

declare var require: any;
const addressDeployed = require('../../ethereum/deploy/addressDeployed.json');
const electionContract = require('../../ethereum/build/Election.json');

declare var window;

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  election;

  constructor(private web3Service: Web3Service) {
    console.log(addressDeployed.address,JSON.parse(electionContract.interface));
    this.election = new web3Service.web3.eth.Contract(
      JSON.parse(electionContract.interface),
      addressDeployed.address
    );
  }
}
