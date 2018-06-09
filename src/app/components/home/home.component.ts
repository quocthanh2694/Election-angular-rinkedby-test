import { Component, OnInit } from '@angular/core';
import { ElectionService } from '../../services/election-eth/election.service';
import { Web3Service } from '../../services/web3/web3.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  candidateCount;
  candidateList = [];
  yourAccount;
  voteAccountId;
  isLoadding = false;

  constructor(private electionService: ElectionService,
    private web3Service: Web3Service) {
    this.isLoadding = true;
    console.log(electionService.election);

    electionService.election.methods.manager().call().then((result) => {
      console.log('owner: ', result);
    });

    electionService.election.methods.candidatesCount().call().then((result) => {
      this.candidateCount = result;
      console.log('candidatesCount: ', result);
      this.getListCandidate();
    });

    web3Service.web3.eth.getAccounts().then((res) => {
      console.log('accounts: ', res);
      this.yourAccount = res[0];
    })
  }

  ngOnInit() {
  }

  getListCandidate() {
    this.candidateList = [];
    for (let i = 1; i <= this.candidateCount; i++) {
      this.electionService.election.methods.candidates(i).call().then((result) => {
        this.candidateList.push(result);
        if (i == this.candidateCount) {
          this.isLoadding = false;
        }
      });

    }
  }

  vote() {
    this.isLoadding = true;
    console.log(this.voteAccountId);
    this.electionService.election.methods.vote(this.voteAccountId)
      .send({
        from: this.yourAccount,
        gas: '1000000'
      })
      .then((result) => {
        console.log('success', result);
        this.getListCandidate();
      }, (err) => {
        console.error('err', err);
      });
  }

}
