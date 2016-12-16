//should be canvas
type Board = string[][];
interface IState {
  board: Board;
}

interface ICanvas {
  
}

module gameLogic {

  export let endGame: boolean = false;
  export let level = 0;
  let answer_array: string[] = [
    "DOG", "LIP", 
    // "BAG", "CAR", "CAT", "EAR", "ANT",
    // "FISH", "FRIES", "PEAR", "COLA", "HAND", "DESK", "BIRD", "BOAT",
    // "FRIES", "MOUSE", "DANCE", "BRUSH",
  ];
  export let answer: string = answer_array[level];
  // export let answer_nums: Array<number> = Array.from(answer.length.keys());
  export let answer_nums: number[] = [];
  for (let i: number = 0; i < answer.length; i++) {
    answer_nums.push(i);
  }

  export function newRound() {
    level = level + 1;
    // no more words
    if (level == answer_array.length) {
      endGame = true;
      console.log("end game");
      return;
    }
    answer = answer_array[level];
    answer_nums = [];
    for (let i: number = 0; i < answer.length; i++) {
      answer_nums.push(i);
    }
    // answer_nums = Array.from(Array(answer.length).keys())
  }

  // judge if the guess correctly
  export function judge(word: string): boolean {
    if (word == answer) {
      return true;
    } else {
      return false;
    }
  }

  export function getInitialBoard(): Board {
    let board: Board = [];
    return board;
  }

  export function getInitialState(): IState {
    return { board: getInitialBoard() };
  }

  export function createMove(
    stateBeforeMove: IState, canvas: ICanvas, turnIndexBeforeMove: number): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    let board: Board = stateBeforeMove.board;
    let boardAfterMove = angular.copy(board);
    // boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
    let endMatchScores: number[];
    let turnIndexAfterMove: number;
    if (endGame) {
      turnIndexAfterMove = 1 - turnIndexBeforeMove;
      endMatchScores = null;
    }
    let stateAfterMove: IState = { board: boardAfterMove };
    return { endMatchScores: endMatchScores, turnIndexAfterMove: turnIndexAfterMove, stateAfterMove: stateAfterMove };
  }

  export function createInitialMove(): IMove {
    return {
      endMatchScores: null, turnIndexAfterMove: 0,
      stateAfterMove: getInitialState()
    };
  }

  export function checkMoveOk(stateTransition: IStateTransition): void {
    // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
    // to verify that the move is OK.
    let turnIndexBeforeMove = stateTransition.turnIndexBeforeMove;
    let stateBeforeMove: IState = stateTransition.stateBeforeMove;
    let move: IMove = stateTransition.move;
    if (!stateBeforeMove && turnIndexBeforeMove === 0 &&
      angular.equals(createInitialMove(), move)) {
      return;
    }
    let expectedMove = createMove(stateBeforeMove, turnIndexBeforeMove);
    if (!angular.equals(move, expectedMove)) {
      throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
        ", but got stateTransition=" + angular.toJson(stateTransition, true))
    }
  }
}
