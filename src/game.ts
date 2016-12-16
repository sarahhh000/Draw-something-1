interface SupportedLanguages {
  en: string, iw: string,
  pt: string, zh: string,
  el: string, fr: string,
  hi: string, es: string,
};

interface Translations {
  [index: string]: SupportedLanguages;
}

module game {

  export let hasLvCt = false;
  export let isDrawFinished = false;

  export let currentLevel = "Easy";
  export let currentCategory = "Animal";
  export let levels = ["easy", "medium", "hard"];
  export let categories = ["company", "logo", "fruit", "ct4", "ct5", "ct6", "ct7", "ct8", "ct9"];
  export let colors = ["black", "white", "red", "orange", "yellow", "blue", "green", "violet"];
  export let sizes = [1, 2, 3, 5, 8, 10, 12, 15];
  export let buttons = { "recordBtn": "Record", "playBtn": "Play", "pauseBtn": "Pause", "clearBtn": "Clear" };
  export let currentWord = "someWord";
  export let size = 1;
  export let color = "black";

  export var canvas;
  export var ctx;
  export let isRecording = true;
  export let isMouseDown = false;
  export let lastMouseX = -1;
  export let lastMouseY = -1;
  export let timeinterval:number;


  export let currentDrawType: string;
  export let currentPoint: Point;
  export let line: Board = { points: new Array<Point>() };


  export function createPoint(xVal: number, yVal: number, drawType: string): Point {
    return { x: xVal, y: yVal, timestamp: (new Date()).getTime(), colorStyle: color, sizeStyle: size, type: drawType }
  }

  export function onMouseDown(event) {
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    currentDrawType = "onMouseDown";
    isMouseDown = true;
    let canvasX = canvas.offsetLeft;
    let canvasY = canvas.offsetTop;
    let x = Math.floor(event.clientX - canvasX);
    let y = Math.floor(event.clientY - canvasY);
    currentPoint = createPoint(x, y, currentDrawType);
    drawPoint(currentPoint);
    if (isRecording) {
      line.points.push(currentPoint);
    }
  }

  export function onMouseMove(event) {
    if (isMouseDown) {
      currentDrawType = "onMouseMove";
      let canvasX = canvas.offsetLeft;
      let canvasY = canvas.offsetTop;
      let x = Math.floor(event.clientX - canvasX);
      let y = Math.floor(event.clientY - canvasY);
      currentPoint = createPoint(x, y, currentDrawType);
      drawPoint(currentPoint);
      if (isRecording) {
        line.points.push(currentPoint);
      }
    }
  }

  function drawPoint(point: Point) {
    let x = point.x;
    let y = point.y;
    switch (point.type) {
      case "onMouseDown":
        console.log("function drawpoint-moveto")
        ctx.beginPath();
        ctx.moveTo(x, y);
        console.log(x, y);
        ctx.strokeStyle = point.colorStyle;
        ctx.lineWidth = point.sizeStyle;
        break;
      case "onMouseMove":
        console.log("function drawpoint-lineTo")
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
    }
  }

  export function onMouseUp() {
    isMouseDown = false;
    lastMouseX = -1;
    lastMouseY = -1;
  }

  export function onMouseLeave() {
    isMouseDown = false;
    lastMouseX = -1;
    lastMouseY = -1;
  }

  export function playRecording() {
    clear();
    let pointCount = line.points.length;
    for (let i = 0; i < pointCount; i++) {
      drawPoint(line.points[i]);
    }
  }

  export function schedulePlay() {
    for (let i in line.points) {
      let temp: Point = line.points[i];
      window.setTimeout(function () {
        drawPoint(temp);
      }, temp.timestamp - timeinterval);
    }
  }

  export function setColor(colorVal: string) {
    color = colorVal;
    var colorBtn = <HTMLCanvasElement>document.getElementById("colorVal");
  }
  export function setSize(sizeVal: number) {
    size = sizeVal;
  }

  export function clear() {
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    console.log("clear canvas");
    ctx.clearRect(0, 0, canvas.width, canvas.width);
  }

  // export function submit() {
  //   isDrawFinished = true;
  //   isRecording = false;
  // }
  //canvas operations

  export function setLv(lv: string) {
    currentLevel = lv;
  }

  export function setCt(ct: string) {
    currentCategory = ct;
    // hasLvCt = true;
  }

  // turn: true: guess, false: draw
  export let turn: boolean = true;

  export function drawFinish() {
    console.log("click submit");
    isDrawFinished = true;
    
    isRecording = false;
    let board: Board = line;
    let nextMove: IMove = gameLogic.createMove(
      state, board, currentUpdateUI.move.turnIndexAfterMove);
    makeMove(nextMove);
    turn = !turn;
    clear();
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
    if (next_avaliable_spot_num == gameLogic.answer.length) updateGuesserUI();
  }
  function get_word(): string {
    let word: string = "";
    for (let num in gameLogic.answer_nums) {
      let parent_id: string = "u" + num;
      let ele: HTMLImageElement = <HTMLImageElement>document.getElementById(parent_id).childNodes[0];
      let letter: string = ele.src.substring(73, 74);
      word = word + letter;
    }
    return word;
  }
  export function updateGuesserUI() {
    let word: string = get_word();
    let result: boolean = gameLogic.judge(word);
    if (result) {
      console.log("win");
      document.getElementById("message").innerHTML = "Message: Correct! The answer is\"" + word + "\"!";

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
      turn = !turn;
      console.log("change turn");
    }
  }

  export function get_answer(): string {
    return gameLogic.answer;
  }

  export function get_answer_nums(): number[] {
    return gameLogic.answer_nums;
  }

  function empty_blank() {
    let num: number = gameLogic.answer_nums.length - 1;
    while (num >= 0) {
      let parent_id: string = "u" + num;
      let img: HTMLImageElement = <HTMLImageElement>document.getElementById(parent_id).childNodes[0];
      imgClicked(img);
      num = num - 1;
    }
  }
  export let isInstructionsShowing = false;
  export function toggleInstructions() {
    isInstructionsShowing = !isInstructionsShowing;
    if (isInstructionsShowing) document.getElementById("instruction_button").innerHTML = "Back";
    else document.getElementById("instruction_button").innerHTML = "Help";
  }

  // update UI part
  export let currentUpdateUI: IUpdateUI = null;
  export let state: IState = null;

  export function init() {
    registerServiceWorker();
    translate.setTranslations(getTranslations());
    // resizeGameAreaService.setWidthToHeight(1);
    moveService.setGame({
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      checkMoveOk: gameLogic.checkMoveOk,
      updateUI: updateUI,
      // communityUI: communityUI,
      getStateForOgImage: null,
    });
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
    return {};
  }

  export function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI:", params);
    currentUpdateUI = params;
    state = params.move.stateAfterMove;
    if (isFirstMove()) {
      state = gameLogic.getInitialState();
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
    return currentUpdateUI.move.turnIndexAfterMove >= 0 && // game is ongoing
      currentUpdateUI.yourPlayerIndex === currentUpdateUI.move.turnIndexAfterMove; // it's my turn
  }
}

angular.module('myApp', ['gameServices'])
  .run(function () {
    $rootScope['game'] = game;
    game.init();
  });