import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ChainReaction} from "../../ChainReaction/ChainReaction";

@Component({
  selector: 'app-game-over',
  template: `
    <div class="container">
      <h1 mat-dialog-title>Game Over</h1>
      <div mat-dialog-content>
        <p>{{getWinner().name}} is winner</p>
        <!--        <img class="winner-img" [src]="getWinnerAsset()" alt="">-->
        <img src="/assets/congrats.gif" alt="">
      </div>
      <div mat-dialog-actions>
        <button mat-raised-button color="primary" [mat-dialog-close]="true">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 10px;
    }

    @keyframes rotate360 {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .winner-img {
      animation: rotate360 2s linear infinite;
    }
  `]
})
export class GameOverComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public game: ChainReaction) {
  }

  getWinner() {
    return this.game.getScore(0) > this.game.getScore(1) ? this.game.player1 : this.game.player2;
  }
}
