import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {GameService} from "../game.service";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  progressBar:boolean = false;

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
}
