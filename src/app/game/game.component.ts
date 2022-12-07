import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {GameService} from "../game.service";
import {PlayerType} from "../models/models";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  progressBar: boolean = false;

  constructor(private dialog: MatDialog,
              public gameService: GameService) {
  }

  ngOnInit(): void {
    this.gameService.ngOnInit();
  }


  async askForBestMove() {
    this.progressBar = true;
    const bestMove = await this.gameService.game.hint()
    console.log('bestMove', bestMove);
    await this.gameService.game.click(bestMove.i, bestMove.j, true);
    this.progressBar = false;
    this.gameService.game.logCount();
  }

  isFirstPlayer(): boolean {
    return this.gameService.game.player1.playerType == PlayerType.MinMax && this.gameService.game.currentPlayer.color == this.gameService.game.player1.color;
  }
  isSecondPlayer(): boolean {
    return this.gameService.game.player2.playerType == PlayerType.MinMax && this.gameService.game.currentPlayer.color == this.gameService.game.player2.color;
  }

  async play2() {
    if(!this.progressBar)
      await this.askForBestMove();
  }
  async play1() {
    if(!this.progressBar)
      await this.askForBestMove();
  }
}
