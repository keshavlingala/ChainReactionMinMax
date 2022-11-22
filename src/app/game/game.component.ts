import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Color, dotsAssets} from "../models/models";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog.component";
import {animate, state, style, transition, trigger} from "@angular/animations";

interface IGame {
  color: string;
  value: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({transform: 'translateX(0)'})),
      transition('* => *', [
        style({transform: 'translateX(-100%)'}),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class GameComponent implements OnInit, OnChanges {
  rows: number = 3;
  cols: number = 3;
  started: { [key in Color]: boolean } = {
    '#00bcd4': false,
    '#263238': false,
    '#9e9e9e': false
  }
  player1 = {
    name: 'Player 1',
    color: Color.Primary,
    playerType: 'human'
  }
  player2 = {
    name: 'Player 2',
    color: Color.Secondary,
    playerType: 'human'
  }
  currentPlayer = this.player1
  gameData: IGame[][] = Array(3).fill(0).map(() => Array(3).fill(0).map(() => {
    return {color: Color.Gray, value: 0}
  }));

  constructor(private dialog: MatDialog) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.gameOver()) {
      this.dialog.open(DialogComponent, {
        data: {
          winner: this.currentPlayer.name
        }
      }).afterClosed().subscribe(result => {
        this.reset();
      });
    }
  }

  ngOnInit(): void {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.player1 = {
          name: result.player1,
          color: Color.Primary,
          playerType: result.player1Type
        }
        this.player2 = {
          name: result.player2,
          color: Color.Secondary,
          playerType: result.player2Type
        }
        this.currentPlayer = this.player1
        let n = result.playgroundSize;
        this.gameData = Array(n).fill(0).map(() => Array(n).fill(0).map(() => {
          return {color: Color.Gray, value: 0}
        }));
        this.rows = n;
        this.cols = n;
      }
      console.log(result);
    });
    console.log({component: this})
  }

  click(x: number, y: number) {
    if (this.gameData[x][y].value == 0 || this.gameData[x][y].color == this.currentPlayer.color || this.gameData[x][y].color == Color.Gray) {
      this.increment(x, y, this.currentPlayer.color);
      this.currentPlayer = this.currentPlayer == this.player1 ? this.player2 : this.player1;
    } else {
      alert('Wrong Player');
    }
    this.started[this.currentPlayer.color] = true;
  }

  getAccessibleCells(x: number, y: number) {
    let cells = [];
    if (x > 0) {
      cells.push({x: x - 1, y: y});
    }
    if (x < this.rows - 1) {
      cells.push({x: x + 1, y: y});
    }
    if (y > 0) {
      cells.push({x: x, y: y - 1});
    }
    if (y < this.cols - 1) {
      cells.push({x: x, y: y + 1});
    }
    return cells;
  }

  getAsset(cell: IGame): string {
    if (cell.color == Color.Primary) {
      return dotsAssets.primary[cell.value];
    } else if (cell.color == Color.Secondary) {
      return dotsAssets.secondary[cell.value];
    } else {
      return dotsAssets.primary[cell.value];
    }
  }

  getImageStyle(cell: IGame) {
    return {
      'background-image': `url(${this.getAsset(cell)})`,
    }
  }

  private reset() {
    this.gameData = this.gameData.map(row => row.map(cell => {
      return {color: Color.Gray, value: 0}
    }));
    this.started[Color.Primary] = false;
    this.started[Color.Secondary] = false;
  }

  private async increment(x: number, y: number, color: Color) {
    if (this.gameOver()) {
      return;
    }
    let typeOfCell = this.getTypeOfCell(x, y);
    if (typeOfCell == 'corner') {
      this.gameData[x][y].value += 1;
      this.gameData[x][y].color = color;
      if (this.gameData[x][y].value >= 2) {
        this.gameData[x][y].value = 0;
        await new Promise(resolve => setTimeout(resolve, 500));
        for (let cell of this.getAccessibleCells(x, y)) {
          this.increment(cell.x, cell.y, color);
        }

      }
    }
    if (typeOfCell == 'side') {
      this.gameData[x][y].value += 1;
      this.gameData[x][y].color = color;
      if (this.gameData[x][y].value >= 3) {
        this.gameData[x][y].value = 0;
        await new Promise(resolve => setTimeout(resolve, 500));
        for (let cell of this.getAccessibleCells(x, y)) {
          this.increment(cell.x, cell.y, color);
        }
      }
    }
    if (typeOfCell == 'center') {
      this.gameData[x][y].value += 1;
      this.gameData[x][y].color = color;
      if (this.gameData[x][y].value >= 4) {
        this.gameData[x][y].value = 0;
        await new Promise(resolve => setTimeout(resolve, 500));
        for (let cell of this.getAccessibleCells(x, y)) {
          this.increment(cell.x, cell.y, color);
        }
      }
    }
  }

  private getTypeOfCell(row: number, col: number) {
    let sideX = row == 0 || row == this.rows - 1;
    let sideY = col == 0 || col == this.cols - 1;
    if (sideX && sideY) {
      return 'corner';
    }
    if (sideX || sideY) {
      return 'side';
    }
    return 'center';
  }

  private gameOver() {
    let set = new Set(this.gameData.flat(1).map(i => i.color).filter(v => v != Color.Gray));
    return set.size == 1 && this.started[Color.Primary] && this.started[Color.Secondary];
  }
}
