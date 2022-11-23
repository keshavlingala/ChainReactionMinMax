import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-game-over',
  template: `
    <div class="container">
      <h1 mat-dialog-title>Game Over</h1>
      <div mat-dialog-content>
        <p>Winner: {{winner}}</p>
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
  `]
})
export class GameOverComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public winner: string) {
  }

}
