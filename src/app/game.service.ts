import {Injectable, OnInit} from '@angular/core';
import {Color, GameConfig, PlayerType} from "./models/models";
import {Observable} from "rxjs";
import {GameOverComponent} from "./game/gameover.component";
import {DialogComponent} from "./game/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ChainReaction} from "./ChainReaction/ChainReaction";


@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit {
  game: ChainReaction = new ChainReaction({
    player1: {
      name: 'Player 1',
      color: Color.Primary,
      playerType: PlayerType.Human
    },
    player2: {
      name: 'Player 2',
      color: Color.Secondary,
      playerType: PlayerType.Human
    },
    playgroundSize: 3
  }, this.getBlast, this.getErrorAudio);
  gameOver!: Observable<boolean>;
  blinker = this.game.blinker.asObservable();

  constructor(private dialog: MatDialog) {
    this.blinker.subscribe(this.blinkerSubscriber);
  }

  private get getBlast() {
    const audio = new Audio('assets/click.wav');
    audio.playbackRate = 2;
    return audio;
  }

  private get getErrorAudio() {
    return new Audio('assets/error.wav');
  }

  ngOnInit() {
    let config: GameConfig;
    this.dialog.open(DialogComponent)
      .afterClosed()
      .subscribe(result => {
        console.log(result);
        if (result) {
          config = {
            player1: {
              name: result.player1,
              color: Color.Primary,
              playerType: result.player1Type
            },
            player2: {
              name: result.player2,
              color: Color.Secondary,
              playerType: result.player2Type
            },
            playgroundSize: result.playgroundSize
          }
          this.game = new ChainReaction(config, this.getBlast, this.getErrorAudio);
        }
        this.gameOver = this.game.isOver();
        this.gameOver.subscribe(result => {
          console.log('game over', result);
          if (result) {
            this.dialog.open(GameOverComponent, {
              data: this.game.currentPlayer.color == Color.Primary ? this.game.player2.name : this.game.player1.name
            }).afterClosed().subscribe(result => {
              this.game.reset();
              this.ngOnInit();
            });
          }
        });
        this.blinker= this.game.blinker.asObservable();
        this.blinker.subscribe(this.blinkerSubscriber);
      });

  }

  private blinkerSubscriber(result: Set<string>) {
    console.log('blinker', result);
  }
}
