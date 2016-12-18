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

  let answer_array: string[] = [
    "DOG", "LIP", "CAR", "ANT", "TOE", "BED",
    "GIFT", "LOVE", "FISH", "PEAR", "COLA", "HAIR", "DESK",
    "BIRD", "PLUG", "SNOW", "BIKE", "SALE", "WORD", "BATH",
    "FRIES", "MOUSE", "DANCE", "JEANS", "PIANO", "PHONE",
    "SHADOW", "HOLIDAY", "KETCHUP", "BIRTHDAY"
  ];

  function getRandomIndex(): number {
    return Math.floor(Math.random() * answer_array.length);
  }

  export let answer: string;
  export let answer_nums: number[] = [];

  export function newRound() {
    let index: number = getRandomIndex();
    answer = answer_array[index];
    answer_nums = [];
    for (let i: number = 0; i < answer.length; i++) {
      answer_nums.push(i);
    }
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
    let board: Board = { points: [] };
    return board;
  }

  export function getInitialState(): IState {
    newRound();
    return { board: getInitialBoard(), answer: answer };
  }

  export function createMove(
    stateBeforeMove: IState, board: Board, turnIndexBeforeMove: number): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    let endMatchScores: number[];
    let turnIndexAfterMove: number;
    turnIndexAfterMove = 1 - turnIndexBeforeMove;
    endMatchScores = null;
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
