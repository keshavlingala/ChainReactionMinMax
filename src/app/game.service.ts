import {Injectable, OnInit} from '@angular/core';
import {Color, GameConfig, PlayerType} from "./models/models";
import {Observable} from "rxjs";
import {GameOverComponent} from "./game/dialog/gameover.component";
import {DialogComponent} from "./game/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ChainReaction} from "./ChainReaction/ChainReaction";


@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit {
  game!: ChainReaction;
  gameOver!: Observable<boolean>;

  constructor(public dialog: MatDialog) {

  }

  get blinker() {
    return this.game.blinker;
  }

  ngOnInit() {
    let config: GameConfig = {
      player1: {
        name: 'Player 1',
        color: Color.Primary,
        playerType: PlayerType.Human,
      },
      player2: {
        name: 'Player 2',
        color: Color.Secondary,
        playerType: PlayerType.MinMax,
      },
      playgroundSize: 3
    };
    this.dialog.open(DialogComponent)
      .afterClosed()
      .subscribe(result => {
        // Configuring Game here
        if (result) {
          config = {
            player1: {
              name: result.player1,
              color: Color.Primary,
              playerType: result.player1Type,
            },
            player2: {
              name: result.player2,
              color: Color.Secondary,
              playerType: result.player2Type
            },
            playgroundSize: result.playgroundSize
          }
          this.game = new ChainReaction(config);
        } else {
          this.game = new ChainReaction(config);
        }
        // Setting Game Over Events
        this.gameOver = this.game.isOver();
        this.gameOver.subscribe((result) => {
          // console.log('game over', result);
          // console.log('dialog', this.dialog);
          if (result) {
            this.dialog.open(GameOverComponent, {
              data: this.game.currentPlayer,
            }).afterClosed().subscribe(result => {
              this.game.reset();
              this.ngOnInit();
            });
          }
        });

        // Setting Game Players
        if (config.player1.playerType == PlayerType.MinMax) {
          // console.log('decided and clicked by minmax player 1');
        }
        if (config.player2.playerType == PlayerType.MinMax) {
          console.log('decided and clicked by minmax player 2');
        }
      });

  }


}
