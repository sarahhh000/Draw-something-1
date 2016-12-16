;
var game;
(function (game) {
    game.hasLvCt = false;
    game.isDrawFinished = false;
    game.currentLevel = "Easy";
    game.currentCategory = "Animal";
    game.levels = ["easy", "medium", "hard"];
    game.categories = ["company", "logo", "fruit", "ct4", "ct5", "ct6", "ct7", "ct8", "ct9"];
    game.colors = ["black", "white", "red", "orange", "yellow", "blue", "green", "violet"];
    game.sizes = [1, 2, 3, 5, 8, 10, 12, 15];
    game.buttons = { "recordBtn": "Record", "playBtn": "Play", "pauseBtn": "Pause", "clearBtn": "Clear" };
    game.currentWord = "someWord";
    game.size = 1;
    game.color = "black";
    game.isRecording = true;
    game.isMouseDown = false;
    game.isPlaying = false;
    game.lastMouseX = -1;
    game.lastMouseY = -1;
    game.line = { points: new Array() };
    function createPoint(xVal, yVal, drawType) {
        return { x: xVal, y: yVal, timestamp: (new Date()).getTime(), colorStyle: game.color, sizeStyle: game.size, type: drawType };
    }
    game.createPoint = createPoint;
    function onMouseDown(event) {
        game.canvas = document.getElementById("canvas");
        game.ctx = game.canvas.getContext("2d");
        game.ctx.lineCap = "round";
        game.currentDrawType = "onMouseDown";
        game.isMouseDown = true;
        var canvasX = game.canvas.offsetLeft;
        var canvasY = game.canvas.offsetTop;
        var x = Math.floor(event.clientX - canvasX);
        var y = Math.floor(event.clientY - canvasY);
        if (game.isRecording) {
            game.currentPoint = createPoint(x, y, game.currentDrawType);
            drawPoint(game.currentPoint);
            game.line.points.push(game.currentPoint);
        }
    }
    game.onMouseDown = onMouseDown;
    function onMouseMove(event) {
        if (game.isMouseDown) {
            game.currentDrawType = "onMouseMove";
            var canvasX = game.canvas.offsetLeft;
            var canvasY = game.canvas.offsetTop;
            var x = Math.floor(event.clientX - canvasX);
            var y = Math.floor(event.clientY - canvasY);
            if (game.isRecording) {
                game.currentPoint = createPoint(x, y, game.currentDrawType);
                drawPoint(game.currentPoint);
                game.line.points.push(game.currentPoint);
            }
        }
    }
    game.onMouseMove = onMouseMove;
    function drawPoint(point) {
        var x = point.x;
        var y = point.y;
        switch (point.type) {
            case "onMouseDown":
                console.log("function drawpoint-moveto");
                game.ctx.beginPath();
                game.ctx.moveTo(x, y);
                console.log(x, y);
                game.ctx.strokeStyle = point.colorStyle;
                game.ctx.lineWidth = point.sizeStyle;
                break;
            case "onMouseMove":
                console.log("function drawpoint-lineTo");
                game.ctx.lineTo(x, y);
                game.ctx.stroke();
                break;
        }
    }
    function onMouseUp() {
        game.isMouseDown = false;
        game.lastMouseX = -1;
        game.lastMouseY = -1;
    }
    game.onMouseUp = onMouseUp;
    function onMouseLeave() {
        game.isMouseDown = false;
        game.lastMouseX = -1;
        game.lastMouseY = -1;
    }
    game.onMouseLeave = onMouseLeave;
    function playRecording() {
        clear();
        var pointCount = game.line.points.length;
        for (var i = 0; i < pointCount; i++) {
            drawPoint(game.line.points[i]);
        }
    }
    game.playRecording = playRecording;
    function schedulePlay() {
        document.getElementById("Play").style.display = "none";
        clear();
        game.isRecording = false;
        var startTime = game.line.points[0].timestamp;
        var _loop_1 = function(i) {
            var temp = game.line.points[i];
            window.setTimeout(function () {
                drawPoint(temp);
            }, temp.timestamp - startTime);
        };
        for (var i in game.line.points) {
            _loop_1(i);
        }
        window.setTimeout(function () { document.getElementById("Play").style.display = "inline-block"; }, game.line.points[game.line.points.length - 1].timestamp - startTime);
    }
    game.schedulePlay = schedulePlay;
    function setColor(colorVal) {
        game.color = colorVal;
        var colorBtn = document.getElementById("colorVal");
    }
    game.setColor = setColor;
    function setSize(sizeVal) {
        game.size = sizeVal;
    }
    game.setSize = setSize;
    function clear() {
        game.canvas = document.getElementById("canvas");
        game.ctx = game.canvas.getContext("2d");
        console.log("clear canvas");
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.width);
    }
    game.clear = clear;
    // export function submit() {
    //   isDrawFinished = true;
    //   isRecording = false;
    // }
    //canvas operations
    function setLv(lv) {
        game.currentLevel = lv;
    }
    game.setLv = setLv;
    function setCt(ct) {
        game.currentCategory = ct;
        // hasLvCt = true;
    }
    game.setCt = setCt;
    // turn: true: guess, false: draw
    game.turn = true;
    function drawFinish() {
        console.log("click submit");
        game.isDrawFinished = true;
        game.isRecording = false;
        var board = game.line;
        var nextMove = gameLogic.createMove(game.state, board, game.currentUpdateUI.move.turnIndexAfterMove);
        makeMove(nextMove);
        game.turn = !game.turn;
        clear();
    }
    game.drawFinish = drawFinish;
    var allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    function getLetter(col) {
        return allLetters[col];
    }
    game.getLetter = getLetter;
    var next_avaliable_spot_num = 0;
    function imgClicked(img) {
        var id = img.id;
        var old_parent = img.parentElement;
        var old_parent_id = img.parentElement.id;
        var old_parent_pos = img.parentElement.id[0];
        var new_parent_id;
        if (old_parent_pos == "u") {
            if (parseInt(old_parent_id.substring(1)) != next_avaliable_spot_num - 1)
                return;
            next_avaliable_spot_num = next_avaliable_spot_num - 1;
            new_parent_id = "d" + id;
        }
        else {
            new_parent_id = "u" + next_avaliable_spot_num;
            next_avaliable_spot_num = next_avaliable_spot_num + 1;
        }
        var new_parent = document.getElementById(new_parent_id);
        new_parent.appendChild(img);
        if (next_avaliable_spot_num == gameLogic.answer.length)
            updateGuesserUI();
    }
    game.imgClicked = imgClicked;
    function get_word() {
        var word = "";
        for (var num in gameLogic.answer_nums) {
            var parent_id = "u" + num;
            var ele = document.getElementById(parent_id).childNodes[0];
            var letter = ele.src.substring(ele.src.lastIndexOf("/")).substring(8, 9);
            word = word + letter;
        }
        return word;
    }
    function updateGuesserUI() {
        clear();
        game.isDrawFinished = false;
        var word = get_word();
        var result = gameLogic.judge(word);
        if (result) {
            console.log("win");
            document.getElementById("message").innerHTML = "Message: Correct! The answer is\"" + word + "\"!";
        }
        else {
            document.getElementById("message").innerHTML = "Message: Wrong answer \"" + word + "\", guess again!";
        }
        empty_blank();
        if (result) {
            gameLogic.newRound();
            if (gameLogic.endGame) {
                document.getElementById("end_game_message").innerHTML = "Message: Congrats!! All words are correctly guessed!!";
                return;
            }
            game.turn = !game.turn;
            console.log("change turn");
        }
    }
    game.updateGuesserUI = updateGuesserUI;
    function get_answer() {
        return gameLogic.answer;
    }
    game.get_answer = get_answer;
    function get_answer_nums() {
        return gameLogic.answer_nums;
    }
    game.get_answer_nums = get_answer_nums;
    function empty_blank() {
        var num = gameLogic.answer_nums.length - 1;
        while (num >= 0) {
            var parent_id = "u" + num;
            var img = document.getElementById(parent_id).childNodes[0];
            imgClicked(img);
            num = num - 1;
        }
    }
    game.isInstructionsShowing = false;
    function toggleInstructions() {
        game.isInstructionsShowing = !game.isInstructionsShowing;
        if (game.isInstructionsShowing)
            document.getElementById("instruction_button").innerHTML = "Back";
        else
            document.getElementById("instruction_button").innerHTML = "Help";
    }
    game.toggleInstructions = toggleInstructions;
    // update UI part
    game.currentUpdateUI = null;
    game.state = null;
    function init() {
        registerServiceWorker();
        translate.setTranslations(getTranslations());
        // resizeGameAreaService.setWidthToHeight(0.7);
        moveService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            checkMoveOk: gameLogic.checkMoveOk,
            updateUI: updateUI,
            // communityUI: communityUI,
            getStateForOgImage: null,
        });
    }
    game.init = init;
    function registerServiceWorker() {
        // I prefer to use appCache over serviceWorker
        // (because iOS doesn't support serviceWorker, so we have to use appCache)
        // I've added this code for a future where all browsers support serviceWorker (so we can deprecate appCache!)
        if (!window.applicationCache && 'serviceWorker' in navigator) {
            var n = navigator;
            log.log('Calling serviceWorker.register');
            n.serviceWorker.register('service-worker.js').then(function (registration) {
                log.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function (err) {
                log.log('ServiceWorker registration failed: ', err);
            });
        }
    }
    function getTranslations() {
        return {};
    }
    function updateUI(params) {
        log.info("Game got updateUI:", params);
        game.currentUpdateUI = params;
        game.state = params.move.stateAfterMove;
        if (isFirstMove()) {
            game.turn = false;
            game.state = gameLogic.getInitialState();
        }
        else {
            game.turn = true;
        }
    }
    game.updateUI = updateUI;
    function makeMove(move) {
        moveService.makeMove(move);
    }
    function isFirstMove() {
        return !game.currentUpdateUI.move.stateAfterMove;
    }
    function yourPlayerIndex() {
        return game.currentUpdateUI.yourPlayerIndex;
    }
    function isMyTurn() {
        return game.currentUpdateUI.move.turnIndexAfterMove >= 0 &&
            game.currentUpdateUI.yourPlayerIndex === game.currentUpdateUI.move.turnIndexAfterMove; // it's my turn
    }
    game.isMyTurn = isMyTurn;
})(game || (game = {}));
angular.module('myApp', ['gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    game.init();
});
//# sourceMappingURL=game.js.map