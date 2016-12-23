interface SupportedLanguages {
  en: string, zh: string,
};

interface Translations {
  [index: string]: SupportedLanguages;
}

module game {
  export let didMakeMove: boolean = false;
  // export let isHolding:boolean = false;

  export let colors = ["white", "red", "yellow", "blue", "green", "black"];
  export let sizes = [4, 6, 8, 10, 12];
  export let size = 4;
  export let color = "black";

  export var canvas;
  export var ctx;
  export let isMouseDown = false;
  export let isDrawing = true;

  export let currentDrawType: string;
  export let currentPoint: Point;
  export let line: Board = { points: new Array<Point>() };
  export var timeoutList = [];

  export function createPoint(xVal: number, yVal: number, drawType: string): Point {
    return { x: xVal, y: yVal, timestamp: (new Date()).getTime(), colorStyle: color, sizeStyle: size, type: drawType }
  }

  function handleDragEvent(type: string, X:number, Y:number, event) {
    if (isDrawing) {
      if (type == "touchstart") {
        onMouseDown(event, X, Y);
      }
      if (type == "touchmove") {
        onMouseMove(event, X, Y);
      }
      if (type == "touchend") {
        onMouseUp();
      }
    }
  }

  export function onMouseDown(event, X:number, Y:number) {
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    currentDrawType = "onMouseDown";
    isMouseDown = true;
    let canvasX = canvas.offsetLeft;
    let canvasY = canvas.offsetTop;
    let x = Math.floor(X - canvasX);
    let y = Math.floor(Y - canvasY);

    if (isDrawing) {
      currentPoint = createPoint(x, y, currentDrawType);
      drawPoint(currentPoint);
      line.points.push(currentPoint);
    }
  }

  export function onMouseMove(event, X: number, Y:number) {
    if (isMouseDown) {
      currentDrawType = "onMouseMove";
      let canvasX = canvas.offsetLeft;
      let canvasY = canvas.offsetTop;
      let x = Math.floor(X - canvasX);
      let y = Math.floor(Y - canvasY);

      if (isDrawing) {
        currentPoint = createPoint(x, y, currentDrawType);
        drawPoint(currentPoint);
        line.points.push(currentPoint);
      }
    }
  }

  function drawPoint(point: Point) {
    let x = point.x;
    let y = point.y;
    switch (point.type) {
      case "onMouseDown":
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = point.colorStyle;
        ctx.lineWidth = point.sizeStyle;
        break;
      case "onMouseMove":
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
    }
  }

  export function onMouseUp() {
    isMouseDown = false;
  }

  export function onMouseLeave() {
    isMouseDown = false;
  }

  export function schedulePlay() {
    let tempLine = state.board;
    if (!tempLine.points[0]) {
      console.log("empty recording!");
      return false;
    }
    document.getElementById("Play").style.display = "none";
    clear();
    let startTime = tempLine.points[0].timestamp;
    for (let i in tempLine.points) {
      let temp: Point = tempLine.points[i];
      timeoutList[i] = window.setTimeout(function () {
        drawPoint(temp);
      }, temp.timestamp - startTime);
    }
    window.setTimeout(function () { document.getElementById("Play").style.display = "inline-block"; }, tempLine.points[tempLine.points.length - 1].timestamp - startTime);
  }

  export function setColor(colorVal: string) {
    emptyColorStyle();
    color = colorVal;
    document.getElementById(color + "box").style.border = "2.5px solid white";
  }

  function emptyColorStyle() {
    for (let i in colors) {
      document.getElementById(colors[i] + "box").style.border = "0px";
    }
  }

  export function setSize(sizeVal: number) {
    emptySizeStyle();
    size = sizeVal;
    document.getElementById("size" + size).style.border = "2.5px solid black";
  }

  function emptySizeStyle() {
    for (let i in sizes) {
      document.getElementById("size" + sizes[i]).style.border = "0";
    }
  }

  export function clear() {
    line.points = [];
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.width);
  }

  export function drawFinish() {
    if (didMakeMove) { // Only one move per updateUI
      return;
    }
    if (!line.points[0]) {
      console.log("empty recording");
      return false;
    }
    didMakeMove = true;
    document.getElementById("message").innerHTML = "";
    isDrawing = false;
    let board: Board = line;
    let newState: IState = { board: board, answer: game.get_answer() };
    let nextMove: IMove = gameLogic.createMove(
      state, newState, currentUpdateUI.move.turnIndexAfterMove);
    makeMove(nextMove);
    clear();
    // isHolding = true;
    applyScope();
  }

  let allLetters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  export function getLetter(col: number): string {
    return allLetters[col];
  }
  let next_avaliable_spot_num: number = 0;

  export function imgClicked(img: HTMLImageElement) {
    let id = img.id;
    let old_parent = img.parentElement;
    let old_parent_id = img.parentElement.id;
    let old_parent_pos = img.parentElement.id[0];
    let new_parent_id: string;
    if (old_parent_pos == "u") {
      if (parseInt(old_parent_id.substring(1)) != next_avaliable_spot_num - 1) return;
      next_avaliable_spot_num = next_avaliable_spot_num - 1;
      new_parent_id = "d" + id;
    } else { // old_parent_pos == 'd'
      new_parent_id = "u" + next_avaliable_spot_num;
      next_avaliable_spot_num = next_avaliable_spot_num + 1;
    }
    let new_parent = document.getElementById(new_parent_id);
    new_parent.appendChild(img);
    if (next_avaliable_spot_num == state.answer.length) updateGuesserUI();
  }
  function get_word(): string {
    let word: string = "";
    for (let num in get_answer_nums()) {
      let parent_id: string = "u" + num;
      let ele: HTMLImageElement = <HTMLImageElement>document.getElementById(parent_id).childNodes[0];
      let letter: string = ele.src.substring(ele.src.lastIndexOf("/")).substring(8, 9);
      word = word + letter;
    }
    return word;
  }

  export function updateGuesserUI() {
    let word: string = get_word();
    let result: boolean = gameLogic.judge(word, state.answer);
    if (result) {
      for (let i in timeoutList) {
        window.clearTimeout(timeoutList[i]);
      }
      document.getElementById("message").innerHTML = "Message: Correct! The answer is\"" + word + "\"!";
      line.points = [];
      state.board.points = [];
      clear();
    } else {
      document.getElementById("message").innerHTML = "Message: Wrong answer \"" + word + "\", guess again!";
    }
    empty_blank();
    if (result) {
      gameLogic.newRound();
      if (gameLogic.endGame) {
        document.getElementById("end_game_message").innerHTML = "Message: Congrats!! All words are correctly guessed!!";
        return;
      }
      isDrawing = !isDrawing;
      // isHolding = false;
      applyScope();
    }
    
  }

  function applyScope() {
    $rootScope.$apply();
  }

  export function get_answer(): string {
    return gameLogic.answer;
  }

  export function get_answer_nums(): number[] {
    let ans = state.answer;
    let answer_nums: number[] = [];
    for (let i: number = 0; i < ans.length; i++) {
      answer_nums.push(i);
    }
    return answer_nums;
  }

  function empty_blank() {
    let num: number = get_answer_nums().length - 1;
    while (num >= 0) {
      let parent_id: string = "u" + num;
      let img: HTMLImageElement = <HTMLImageElement>document.getElementById(parent_id).childNodes[0];
      imgClicked(img);
      num = num - 1;
    }
  }
  export let isInstructionsShowing = false;
  export function showInstructions() {
    isInstructionsShowing = true;
  }

  export function hideInstructions() {
    isInstructionsShowing = false;
  }

  // update UI part
  export let currentUpdateUI: IUpdateUI = null;
  export let state: IState = null;

  export function init() {
    registerServiceWorker();
    translate.setTranslations(getTranslations());
    // resizeGameAreaService.setWidthToHeight(0.7);
    applyScope();
    moveService.setGame({
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      checkMoveOk: gameLogic.checkMoveOk,
      updateUI: updateUI,
      // communityUI: communityUI,
      getStateForOgImage: null,
    });
    dragAndDropService.addDragListener("canvas", handleDragEvent);
    applyScope();
  }

  function registerServiceWorker() {
    // I prefer to use appCache over serviceWorker
    // (because iOS doesn't support serviceWorker, so we have to use appCache)
    // I've added this code for a future where all browsers support serviceWorker (so we can deprecate appCache!)
    if (!window.applicationCache && 'serviceWorker' in navigator) {
      let n: any = navigator;
      log.log('Calling serviceWorker.register');
      n.serviceWorker.register('service-worker.js').then(function (registration: any) {
        log.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function (err: any) {
        log.log('ServiceWorker registration failed: ', err);
      });
    }
  }

  function getTranslations(): Translations {
    return {
      "Please wait...": {
        "en": "Please wait...",
        "zh": "请耐心等待"
      },
      "Your opponent is playing!": {
        "en": "Your opponent is playing!",
        "zh": "您的对手完成"
      },
      "PLAY": {
        "en": "Play",
        "zh": "播放"
      },
      "SUBMIT": {
        "en": "Submit",
        "zh": "提交"
      },
      "HELP": {
        "en": "Help",
        "zh": "帮助"
      },
      "BACK": {
        "en": "Back",
        "zh": "后退"
      },
      "Sketch And Guess": {
        "en": "Sketch And Guess",
        "zh": "你猜我画"
      },
      "Instructions": {
        "en": "Instructions",
        "zh": "说明"
      },
      "INSMsg": {
        "en": "The goal of Sketch And Guess Game is to guess all words correctly from the users' sketches. Two players will exchange roles as guess user and sketch user each round. There are currently 30 words in the game.",
        "zh": "你画我猜游戏的目标是根据图画正确猜出单词。每轮游戏，两个玩家将交换角色，轮流作为猜词用户和画图用户。目前在游戏中有30个词。"
      },
      "Sketch Uer Instruction": {
        "en": "Sketch Uer Instruction",
        "zh": "画图用户说明"
      },
      "Sketch the given word in canvas area": {
        "en": "Sketch the given word in canvas area",
        "zh": "在画布区域中画出指定字词"
      },
      "Choose color and strock thickness by clicking": {
        "en": "Choose color and strock thickness by clicking",
        "zh": "点击选择画笔颜色和笔画粗细"
      },
      "The first white color stroke could be used as eraser": {
        "en": "The first white color stroke could be used as eraser",
        "zh": "第一个白色画笔可用作橡皮擦"
      },
      "Click the Submit button in the up right corner when you finish": {
        "en": "Click the 'Submit' button in the up right corner when you finish",
        "zh": "第一个白色画笔可用作橡皮擦"
      },
      "Guess Uer Instruction": {
        "en": "Guess Uer Instruction",
        "zh": "猜词用户说明"
      },
      "Click Play button in up right corner to play the sketches": {
        "en": "Click 'Replay' button in up right corner to play the sketches",
        "zh": "点击右上角的“播放”按钮播放图画"
      },
      "According to the sketches, please guess the word by putting letters into blanks": {
        "en": "According to the sketches, please guess the word by putting letters into blanks",
        "zh": "根据图画，通过将字母放入空白格子来猜测单词"
      },
      "Blank number is exactly the length of answer word": {
        "en": "Blank number is exactly the length of answer word",
        "zh": "空白格数是正确答案的长度"
      },
      "Click letter below canvas area to put it into blank": {
        "en": "Click letter below canvas area to put it into blank",
        "zh": "点击画布区域下方的字母将其放入空白格子"
      },
      "Click the last filled in letter in blank to put letter back": {
        "en": "Click the last filled in letter in blank to put letter back",
        "zh": "点击空白处的最后一个填写的字母，将字母放回"
      },
      "If guessed word is wrong, all blanks will be vacated automatically": {
        "en": "If guessed word is wrong, all blanks will be vacated automatically",
        "zh": "如果猜测的字词有误，所有空白格子将自动清空"
      },
      "After correctly guessing a word, the page will automatically go to the sketch page.": {
        "en": "After correctly guessing a word, the page will automatically go to the sketch page.",
        "zh": "如果猜测的字词正确，网页会自动转到画图页面"
      },
      "Word": {
        "en": "Word",
        "zh": "词"
      },
      "Clear": {
        "en": "Clear",
        "zh": "清空"
      }
    };
  }

  export function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI:", params);
    didMakeMove = false; // Only one move per updateUI
    
    currentUpdateUI = params;
    state = params.move.stateAfterMove;
    if (isFirstMove()) {
      isDrawing = true;
      state = gameLogic.getInitialState();
    } else {
      isDrawing = false;
      state = params.move.stateAfterMove;
      // isHolding = false;
      applyScope();
    }
  }

  function makeMove(move: IMove) {
    moveService.makeMove(move);
  }

  function isFirstMove() {
    return !currentUpdateUI.move.stateAfterMove;
  }

  function yourPlayerIndex() {
    return currentUpdateUI.yourPlayerIndex;
  }

  export function isMyTurn() {
    return !didMakeMove &&
      currentUpdateUI.move.turnIndexAfterMove >= 0 && // game is ongoing
      currentUpdateUI.yourPlayerIndex === currentUpdateUI.move.turnIndexAfterMove; // it's my turn
  }
}

angular.module('myApp', ['gameServices'])
  .run(function () {
    $rootScope['game'] = game;
    game.init();
  });