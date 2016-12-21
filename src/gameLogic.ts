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

  export function newRound() {
    let index: number = getRandomIndex();
    answer = answer_array[index];
  }

  // judge if the guess correctly
  export function judge(word: string, ans: string): boolean {
    if (word == ans) {
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
    stateBeforeMove: IState, newState: IState, turnIndexBeforeMove: number): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    let endMatchScores: number[];
    let turnIndexAfterMove: number;
    turnIndexAfterMove = 1 - turnIndexBeforeMove;
    endMatchScores = null;
    let stateAfterMove: IState = angular.copy(newState);
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