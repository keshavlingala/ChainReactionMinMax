export interface IAction {
  i: number;
  j: number;
}
export enum Color {
  Primary = '#00bcd4',
  Secondary = '#263238',
  Gray = '#9e9e9e',
}

export const dotsAssets = {
  primary: [
    './assets/empty.svg',
    './assets/primary1.svg',
    './assets/primary2.svg',
    './assets/primary3.svg'
  ],
  secondary: [
    './assets/empty.svg',
    './assets/secondary1.svg',
    './assets/secondary2.svg',
    './assets/secondary3.svg',
  ]
}

export interface IGame {
  color: string;
  value: number;
}

export enum PlayerType {
  Human = 'Human',
  MinMax = 'MinMax',
}

export interface IPlayer {
  name: string;
  color: Color;
  playerType: PlayerType;
  started?: boolean;
}


export interface GameConfig {
  player1: IPlayer;
  player2: IPlayer,
  playgroundSize: number
}

export interface ChainReactionMin {
  gameData: IGame[][];
  currentPlayer: IPlayer
  player1: IPlayer
  player2: IPlayer
  rows: number
  cols: number
}
export interface BestAction{
  action:IAction,
  score:number
}
