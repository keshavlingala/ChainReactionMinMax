import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Color, IPlayer} from "../../models/models";

@Component({
  selector: 'app-game-over',
  template: `
      <div class="container">
          <h1 mat-dialog-title>Game Over</h1>
          <div mat-dialog-content>
              <p>Winner: {{winner.name}}</p>
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

  constructor(@Inject(MAT_DIALOG_DATA) public winner: IPlayer) {
  }

  getWinnerAsset() {
    return this.winner.color === Color.Primary ? './assets/primary3.svg' : './assets/secondary3.svg';
  }
}
