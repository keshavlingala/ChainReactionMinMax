import {ChainReactionMin, Color, dotsAssets, GameConfig, IAction, IGame, IPlayer} from "../models/models";
import {BehaviorSubject, Observable} from "rxjs";
import {MiniMax} from "./MiniMax";


// var audio = new Audio('audio_file.mp3');
// audio.play();

export class ChainReaction {
  rows: number = 3;
  cols: number = 3;
  player1: IPlayer;
  player2: IPlayer;
  currentPlayer: IPlayer;
  gameData: IGame[][] = Array(3).fill(0).map(() => Array(3).fill(0).map(() => {
    return {color: Color.Gray, value: 0}
  }));
  blinker = new BehaviorSubject<Set<string>>(new Set(''));
  isGameOver = new BehaviorSubject(false);
  // clickAudio: HTMLAudioElement;
  // errorAudio: HTMLAudioElement;
  config: GameConfig;
  count = 0;
  memorize = new Map<string, any>();

  constructor(config: GameConfig) {
    this.config = config;
    // this.clickAudio = new Audio('assets/click.wav');
    // this.clickAudio.playbackRate = 2;
    // this.errorAudio = new Audio('assets/error.wav');
    this.player1 = config.player1;
    this.player2 = config.player2
    this.currentPlayer = this.player1
    let n = config.playgroundSize;
    this.gameData = Array(n).fill(0).map(() => Array(n).fill(0).map(() => {
      return {color: Color.Gray, value: 0}
    }));
    this.rows = n;
    this.cols = n;
    return this;
  }

  gameStateCopy(): ChainReactionMin {
    return {
      gameData: JSON.parse(JSON.stringify(this.gameData)),
      currentPlayer: JSON.parse(JSON.stringify(this.currentPlayer)),
      player1: JSON.parse(JSON.stringify(this.player1)),
      player2: JSON.parse(JSON.stringify(this.player2)),
      rows: this.rows,
      cols: this.cols
    }
  }

  isOver(): Observable<boolean> {
    return this.isGameOver.asObservable();
  }

  isTerminal(): boolean {
    return this.isGameOver.value;
  }

  public async click(x: number, y: number, delayed = false) {
    if (this.gameData[x][y].value == 0 || this.gameData[x][y].color == this.currentPlayer.color || this.gameData[x][y].color == Color.Gray) {
      await this.increment(x, y, this.currentPlayer.color, delayed);
      this.currentPlayer = this.currentPlayer == this.player1 ? this.player2 : this.player1;
    } else {
      // await this.errorAudio.play();
    }
    this.currentPlayer.started = true;
    this.checkGameOver();
    return this;
  }

  public getImageStyle(cell: IGame) {
    return {
      'background-image': `url(${this.getAsset(cell)})`,
    }
  }

  public getScore(number: number) {
    return [
      this.gameData.flat(1).filter(v => v.value > 0 && v.color == Color.Primary).reduce((v, c) => v + c.value, 0),
      this.gameData.flat(1).filter(v => v.value > 0 && v.color == Color.Secondary).reduce((v, c) => v + c.value, 0),
    ][number];
  }

  public reset() {
    // console.log('reset')
    this.gameData = this.gameData.map(row => row.map(cell => {
      return {color: Color.Gray, value: 0}
    }));
    this.isGameOver.next(false);
    this.player1.started = false;
    this.player2.started = false;
  }

  //memorize
  async hint(): Promise<IAction> {
    let state = this.gameStateCopy();
    let key = JSON.stringify(state);
    if (this.memorize.has(key)) {
      return Promise.resolve(this.memorize.get(key));
    }
    const miniMax = new MiniMax(this.config, state);
    const value = await miniMax.bestAction();
    this.memorize.set(key, value);
    return value;
  }

  logCount() {
    // console.log(this.count);
  }

  checkGameOver() {
    if (this.gameOver() && !this.isGameOver.value)
      this.isGameOver.next(true);
  }

  private getAccessibleCells(x: number, y: number) {
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

  private getAsset(cell: IGame): string {
    if (cell.color == Color.Primary) {
      return dotsAssets.primary[cell.value];
    } else if (cell.color == Color.Secondary) {
      return dotsAssets.secondary[cell.value];
    } else {
      return dotsAssets.primary[cell.value];
    }
  }

  private async increment(x: number, y: number, color: Color, delayed = false) {
    this.count++;
    if (this.count > 50000) {
      return;
    }
    if (this.gameOver()) return;

    this.blinker.next(this.blinker.value.add(`${x}-${y}`));
    let typeOfCell = this.getTypeOfCell(x, y);
    if (typeOfCell == 'corner') {
      this.gameData[x][y].value += 1;
      this.gameData[x][y].color = color;
      if (this.gameData[x][y].value >= 2) {
        this.gameData[x][y].value = 0;
        if (delayed) {
          // this.clickAudio.play()
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        for (let cell of this.getAccessibleCells(x, y)) {
          await this.increment(cell.x, cell.y, color);
        }
      }
    }
    if (typeOfCell == 'side') {
      this.gameData[x][y].value += 1;
      this.gameData[x][y].color = color;
      if (this.gameData[x][y].value >= 3) {
        this.gameData[x][y].value = 0;
        if (delayed) {
          // this.clickAudio.play()
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        for (let cell of this.getAccessibleCells(x, y)) {
          await this.increment(cell.x, cell.y, color);
        }
      }
    }
    if (typeOfCell == 'center') {
      this.gameData[x][y].value += 1;
      this.gameData[x][y].color = color;
      if (this.gameData[x][y].value >= 4) {
        this.gameData[x][y].value = 0;
        if (delayed) {
          // this.clickAudio.play()
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        for (let cell of this.getAccessibleCells(x, y)) {
          await this.increment(cell.x, cell.y, color);
        }
      }
    }
    setTimeout(() => {
      this.blinker.value.delete(`${x}-${y}`)
      this.blinker.next(this.blinker.value);
    }, 1000);
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
    let s = new Set(this.gameData.flat(1).map(i => i.color).filter(v => v != Color.Gray));
    return s.size == 1 && this.player1.started && this.player2.started;
  }
}
