// import {IAction, MiniMax, Node} from './MiniMax';
// import {ChainReactionMin, Color, GameConfig, IGame, PlayerType} from "../models/models";
//
// const gameDataFromString = (matrix: number[][]): IGame[][] => {
//   return matrix.map(row => {
//     return row.map(value => {
//       return {
//         color: value == 0 ? Color.Gray : value > 0 ? Color.Primary : Color.Secondary,
//         value: Math.abs(value)
//       }
//     })
//   })
// }
// let config: GameConfig = {
//   player1: {
//     name: 'Player 1',
//     color: Color.Primary,
//     playerType: PlayerType.Human,
//   },
//   player2: {
//     name: 'Player 2',
//     color: Color.Secondary,
//     playerType: PlayerType.MinMax,
//   },
//   playgroundSize: 3
// }
// let miniMax = new MiniMax(config);
// let action: IAction = {i: 0, j: 0}
// let game: ChainReactionMin = {
//   "gameData": gameDataFromString([[1, 1, -1], [0, 0, 0], [0, 0, 0]]),
//   "currentPlayer": {
//     "name": "Player 1",
//     "color": Color.Primary,
//     "playerType": PlayerType.Human
//   },
//   "player1": {
//     "name": "Player 1",
//     "color": Color.Primary,
//     "playerType": PlayerType.Human
//   },
//   "player2": {
//     "name": "Player 2",
//     "color": Color.Secondary,
//     "playerType": PlayerType.MinMax
//   },
//   "rows": 3,
//   "cols": 3
// }
// // let root = new Node(game);
//
// async function test() {
//   // console.log('before')
//   // console.log(action)
//   root.print()
//   let result = await miniMax.action(action, root);
//   // console.log('after')
//   result.print()
// }
//
// test().then(() => {
//   // console.log('done');
// });
//
//
//
//
//
//
