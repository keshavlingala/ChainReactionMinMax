import {ChainReactionMin, Color, GameConfig} from "../models/models";
import {ChainReaction} from "./ChainReaction";

export interface IAction {
  i: number;
  j: number;
}

export class Node {
  state: ChainReactionMin;

  constructor(gameState: ChainReactionMin) {
    this.state = gameState
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

  getHeuristicValue(): number {
    let own = 0;
    let opponent = 0;
    this.state.gameData.flat(1)
      .filter(v => v.color != Color.Gray).forEach(cell => {
      if (cell.color == this.state.currentPlayer.color) {
        own += cell.value;
      } else {
        opponent += cell.value;
      }
    })
    return own;
  }

  public print() {
    let matrixString = ''
    this.state.gameData.forEach(row => {
      matrixString += row.map(cell => '%c ' + cell.value).join(' ') + '\n'
    })
    console.log(...[matrixString, ...this.state.gameData.flat(1).map(cell => `color: ${cell.color}`)])
  }
}

export class MiniMax {
  config!: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
  }

  async getBestAction(game: ChainReactionMin, difficulty: number): Promise<IAction> {
    console.log({game})
    const node = new Node(game);
    console.log('getBestAction current state');
    node.print();
    let bestValue = -Infinity;
    let bestAction: IAction = {i: 0, j: 0};
    for (let action of node.getAvailableActions()) {
      console.log('when action max player', action, 'on', node);
      let child = await this.action(action, node);
      child.print()
      console.log('child heuristic', child.getHeuristicValue(), child.isTerminal())
      let value = await this.minimax(child, difficulty - 1, -Infinity, Infinity, false);
      if (value > bestValue) {
        bestValue = value;
        bestAction = action;
      }
    }
    console.log('bestValue', bestValue, 'bestAction', bestAction);
    console.log('root', node);
    return bestAction;
  }

  async minimax(node: Node, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): Promise<number> {
    if (depth == 0 || node.isTerminal()) {
      if (node.isTerminal()) {
        return maximizingPlayer ? Infinity : -Infinity;
      }
      return node.getHeuristicValue();
    }

    // node.print();
    if (maximizingPlayer) {
      let value = -Infinity;
      for (let action of node.getAvailableActions()) {
        console.log('when action max player', action);
        let child = await this.action(action, node);
        child.print();
        value = Math.max(value, await this.minimax(child, depth - 1, alpha, beta, false));
        alpha = Math.max(alpha, value);
        if (beta <= alpha) {
          break;
        }
      }
      return value;
    } else {
      let value = Infinity;
      for (let action of node.getAvailableActions()) {
        console.log('when action min player', action);
        let child = await this.action(action, node);
        child.print();
        value = Math.min(value, await this.minimax(child, depth - 1, alpha, beta, true));
        beta = Math.min(beta, value);
        if (beta <= alpha) {
          break;
        }
      }
      return value;
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
    return new Node(newGame);
  }
}
