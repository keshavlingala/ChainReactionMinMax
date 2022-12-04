import {ChainReactionMin, Color, GameConfig} from "../models/models";
import {ChainReaction} from "./ChainReaction";

export interface IAction {
  i: number;
  j: number;
}


export class Node {
  state: ChainReactionMin;
  children: Node[] = [];
  isMaxPlayer = false;
  value: number | undefined;
  level: number;
  lastAction: IAction | undefined;

  constructor(gameState: ChainReactionMin, isMaxPlayer: boolean, level: number, createdBy: IAction | undefined) {
    this.state = gameState
    this.isMaxPlayer = isMaxPlayer;
    this.level = level;
    this.lastAction = createdBy;
  }

  isTerminal(): boolean {
    let set = new Set(this.state.gameData.flat(1).map(i => i.color).filter(v => v != Color.Gray));
    return !!(set.size == 1 &&
      this.state.player1.started &&
      this.state.player2.started);
  }

  public print(): void {
    let matrixString = ''
    this.state.gameData.forEach(row => {
      matrixString += row.map(cell => '%c ' + cell.value).join(' ') + '\n'
    })
    console.log(...[matrixString, ...this.state.gameData.flat(1).map(cell => `color: ${cell.color}`)],'last action:',this.lastAction)
  }

}

export class MiniMax {
  config!: GameConfig;
  root: Node;
  treeDepth: number;
  maxColor: Color;

  constructor(config: GameConfig, gameState: ChainReactionMin, difficulty = 3,) {
    this.config = config;
    this.root = new Node(gameState, true, 0, undefined);
    this.root.isMaxPlayer = true
    this.root.level = 0;
    this.treeDepth = difficulty;
    this.maxColor = gameState.currentPlayer.color;
  }

  actions(node: Node): IAction[] {
    let actions: { i: number, j: number }[] = [];
    for (let i = 0; i < node.state.rows; i++) {
      for (let j = 0; j < node.state.cols; j++) {
        if (node.state.gameData[i][j].value == 0 || node.state.gameData[i][j].color == node.state.currentPlayer.color) {
          actions.push({i, j});
        }
      }
    }
    return actions;
  }

  utility(node: Node): number {
    if (node.isTerminal()) {
      return node.state.currentPlayer.color == this.maxColor ? Infinity : -Infinity;
    }
    const own = node.state.gameData.flat(1).filter(v => v.value > 0 && v.color == this.maxColor).reduce((v, c) => v + c.value, 0)
    const opponent = node.state.gameData.flat(1).filter(v => v.value > 0 && v.color != this.maxColor).reduce((v, c) => v + c.value, 0)
    return own - opponent;
  }

  // construct minmax with alpha beta pruning tree with depth = treeDepth
  async constructTree(): Promise<void> {
    let queue = [this.root];
    while (queue.length > 0) {
      let node = queue.shift()!;
      console.log('level', node.level, 'isMaxLevel', node.isMaxPlayer);
      node.print()
      console.log('heuristic', this.utility(node));
      if (node.level == this.treeDepth) {
        continue;
      }
      for (let action of this.actions(node)) {
        let child = await this.result(action, node);
        node.children.push(child);
        queue.push(child);
      }
      console.log('children', node.children.length);
      node.children.forEach(child => {
        child.print();
      })
    }
  }


  async result(action: IAction, node: Node): Promise<Node> {
    console.log('result', action);
    let newGame = new ChainReaction(this.config);
    newGame.gameData = JSON.parse(JSON.stringify(node.state.gameData));
    newGame.currentPlayer = JSON.parse(JSON.stringify(node.state.currentPlayer));
    newGame.player1 = JSON.parse(JSON.stringify(node.state.player1));
    newGame.player2 = JSON.parse(JSON.stringify(node.state.player2));
    newGame.rows = node.state.rows;
    newGame.cols = node.state.cols;
    await newGame.click(action.i, action.j, false);
    return new Node(newGame, !node.isMaxPlayer, node.level + 1, action);
  }

  // return best action for current player
  async bestAction(): Promise<IAction> {
    console.log('best action');
    await this.constructTree();
    let bestAction: IAction = {i: -1, j: -1};
    let bestValue = -Infinity;
    for (let child of this.root.children) {
      let value = this.minValue(child);
      if (value > bestValue && child.lastAction) {
        bestValue = value;
        bestAction = child.lastAction;
      }
    }
    console.log('best value', bestValue);
    if (bestAction.i == -1 && bestAction.j == -1) {
      const availableMoves=this.actions(this.root)
    //  return random move
      return availableMoves[Math.floor(Math.random()*availableMoves.length)]
    }
    return bestAction;
  }

  minValue(node: Node): number {
    if (node.isTerminal() || node.level == this.treeDepth) {
      return this.utility(node);
    }
    console.log('min value', node.level);
    let value = Infinity;
    for (let child of node.children) {
      value = Math.min(value, this.maxValue(child));
    }
    return value;
  }

  maxValue(node: Node): number {
    if (node.isTerminal() || node.level == this.treeDepth) {
      return this.utility(node);
    }
    console.log('max value', node.level);
    let value = -Infinity;
    for (let child of node.children) {
      value = Math.max(value, this.minValue(child));
    }
    return value;
  }


  print() {
    let queue = [this.root];
    while (queue.length > 0) {
      let node = queue.shift()!;
      node.print();
      queue.push(...node.children);
    }
  }
}
