import {BestAction, ChainReactionMin, Color, GameConfig} from "../models/models";
import {ChainReaction} from "./ChainReaction";

export interface IAction {
  i: number;
  j: number;
}


export class Node {
  state: ChainReactionMin;
  children: Node[] = [];
  isMaxPlayer = false;
  lastAction: IAction;
  level = 0;

  constructor(gameState: ChainReactionMin, lastAction: IAction) {
    this.state = gameState
    this.lastAction = lastAction;
  }


  isTerminal(): boolean {
    let set = new Set(this.state.gameData.flat(1).map(i => i.color).filter(v => v != Color.Gray));
    return !!(set.size == 1 &&
      this.state.player1.started &&
      this.state.player2.started);
  }

  getAvailableActions(): IAction[] {
    let actions: { i: number, j: number }[] = [];
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.cols; j++) {
        if (this.state.gameData[i][j].value == 0 || this.state.gameData[i][j].color == this.state.currentPlayer.color) {
          actions.push({i, j});
        }
      }
    }
    return actions;
  }

  public getScore(color: Color) {
    return this.state.gameData.flat(1).filter(v => v.value > 0 && v.color == color).reduce((v, c) => v + c.value, 0)
  }

  public print() {
    let matrixString = ''
    this.state.gameData.forEach(row => {
      matrixString += row.map(cell => '%c ' + cell.value).join(' ') + '\n'
    })
    console.log(...[matrixString, ...this.state.gameData.flat(1).map(cell => `color: ${cell.color}`)],
      'level:', this.level, this.isMaxPlayer ? 'max' : 'min', this.lastAction.i + '-' + this.lastAction.j)
  }

}

export class MiniMax {
  config!: GameConfig;
  root: Node;
  treeDepth: number;
  maxColor: Color;

  constructor(config: GameConfig, gameState: ChainReactionMin, difficulty = 3,) {
    this.config = config;
    this.root = new Node(gameState, {i: -1, j: -1});
    this.root.isMaxPlayer = true
    this.root.level = 0;
    this.treeDepth = difficulty;
    this.maxColor = gameState.currentPlayer.color;
  }

  async getBestMove(): Promise<BestAction> {
    await this.constructTree()
    return this.miniMax(this.root);
  }

  getHeuristic(node: Node): number {
    let score = node.getScore(this.maxColor);
    let opponentScore = node.getScore(this.maxColor == Color.Primary ? Color.Secondary : Color.Primary);
    return score - opponentScore;
  }

  // construct minmax with alpha beta pruning tree with depth = treeDepth
  async constructTree(): Promise<void> {
    let queue = [this.root];
    while (queue.length > 0) {
      let node = queue.shift()!;
      console.log('level', node.level, 'isMaxLevel', node.isMaxPlayer);
      node.print()
      console.log('heuristic', this.getHeuristic(node));
      if (node.level == this.treeDepth) {
        continue;
      }
      let actions = node.getAvailableActions();
      for (let action of actions) {
        let child = await this.action(action, node);
        child.isMaxPlayer = !node.isMaxPlayer;
        child.level = node.level + 1;
        node.children.push(child);
        queue.push(child);
      }
      console.log('children', node.children.length);
      node.children.forEach(child => {
        child.print();
        console.log('score', this.getHeuristic(child));
      })
    }
  }


  async action(action: IAction, node: Node): Promise<Node> {
    let newGame = new ChainReaction(this.config);
    newGame.gameData = JSON.parse(JSON.stringify(node.state.gameData));
    newGame.currentPlayer = JSON.parse(JSON.stringify(node.state.currentPlayer));
    newGame.player1 = JSON.parse(JSON.stringify(node.state.player1));
    newGame.player2 = JSON.parse(JSON.stringify(node.state.player2));
    newGame.rows = node.state.rows;
    newGame.cols = node.state.cols;
    await newGame.click(action.i, action.j, false);
    return new Node(newGame, action);
  }

  miniMax(node: Node): BestAction {
    if (node.children.length == 0) {
      return {
        action: node.lastAction,
        score: this.getHeuristic(node)
      }
    }
    let bestAction: BestAction = {
      action: node.lastAction,
      score: node.isMaxPlayer ? -Infinity : Infinity
    }
    for (let child of node.children) {
      let action = this.miniMax(child);
      if (node.isMaxPlayer) {
        if (action.score > bestAction.score) {
          bestAction = action;
        }
      } else {
        if (action.score < bestAction.score) {
          bestAction = action;
        }
      }
    }
    return bestAction;
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
