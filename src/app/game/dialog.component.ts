import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IPlayer} from "../models/models";

@Component({
  selector: 'app-dialog',
  template: `
    <div class="container">
      <h1 mat-dialog-title class="title">Start the Game</h1>
      <div mat-dialog-content>
        <form class="config-form" [formGroup]="gameConfig">
          <mat-form-field appearance="outline">
            <mat-label>P1 Type</mat-label>
            <mat-select formControlName="player1Type" id="">
              <mat-option value="Human">Human</mat-option>
              <mat-option value="MinMax">MinMax</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>P1 Name</mat-label>
            <input formControlName="player1" matInput type="text">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>P2 Type</mat-label>
            <mat-select formControlName="player2Type" id="">
              <mat-option value="Human">Human</mat-option>
              <mat-option value="MinMax">MinMax</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>P2 Name</mat-label>
            <input formControlName="player2" matInput type="text">
          </mat-form-field>
          <div class="playground">
            <div>
              <label>Playground Size: {{gameConfig.get('playgroundSize')?.value}}</label>
            </div>
            <mat-slider min="3" max="10" step="1" showTickMarks discrete>
              <input matSliderThumb name="playgroundSize" formControlName="playgroundSize">
            </mat-slider>
          </div>
        </form>
      </div>
      <div mat-dialog-actions class="actions">
        <button [disabled]="gameConfig.invalid" [mat-dialog-close]="gameConfig.value" mat-raised-button color="primary">
          Start
        </button>
      </div>
    </div>
  `,
  styles: [`
    .title {
      text-align: center;
    }

    .config-form {
      display: flex;
      flex-direction: column;
      margin: 10px;
    }

    .container {
      padding: 10px;
    }

    .playground {
      width: 100%;

      mat-slider {
        width: 100%;
      }
    }

    .actions {
      display: flex;
      justify-content: center;
    }

  `]
})
export class DialogComponent {
  gameConfig: FormGroup = new FormGroup({
    player1: new FormControl('', [Validators.required]),
    player2: new FormControl('', [Validators.required]),
    player1Type: new FormControl('', [Validators.required]),
    player2Type: new FormControl('', [Validators.required]),
    playgroundSize: new FormControl(3)
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }


}
