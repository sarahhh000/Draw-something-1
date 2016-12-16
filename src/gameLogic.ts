//should be canvas
interface Point {
    x: number;
    y: number;
    timestamp: number;
    colorStyle: string;
    sizeStyle: number;
    type: string;
}

interface Board {
    points: Point[];
}


interface IState {
  board: Board;
  answer: string;
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
    let board: Board = {points:[]};
    return board;
  }

  export function getInitialState(): IState {
    return { board: getInitialBoard(), answer: answer};
  }

  export function createMove(
    stateBeforeMove: IState, board: Board, turnIndexBeforeMove: number): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    let endMatchScores: number[];
    let turnIndexAfterMove: number;
    if (!endGame) {
      turnIndexAfterMove = 1 - turnIndexBeforeMove;
      endMatchScores = null;
    } else {
      turnIndexAfterMove = -1;
      endMatchScores = null;
    }
    let boardAfterMove = angular.copy(board);
    let stateAfterMove: IState = { board: boardAfterMove, answer: answer };
    return { endMatchScores: endMatchScores, turnIndexAfterMove: turnIndexAfterMove, stateAfterMove: stateAfterMove };
  }

  export function createInitialMove(): IMove {
    return {
      endMatchScores: null, turnIndexAfterMove: 0,
      stateAfterMove: getInitialState()
    };
  }

  export function checkMoveOk(stateTransition: IStateTransition): void {
    
  }
}
