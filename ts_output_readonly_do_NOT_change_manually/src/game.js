;
var game;
(function (game) {
    game.didMakeMove = false;
    // export let isHolding:boolean = false;
    game.colors = ["white", "red", "yellow", "blue", "green", "black"];
    game.sizes = [4, 6, 8, 10, 12];
    game.size = 4;
    game.color = "black";
    game.isMouseDown = false;
    game.isDrawing = true;
    game.line = { points: new Array() };
    game.timeoutList = [];
    function createPoint(xVal, yVal, drawType) {
        return { x: xVal, y: yVal, timestamp: (new Date()).getTime(), colorStyle: game.color, sizeStyle: game.size, type: drawType };
    }
    game.createPoint = createPoint;
    function handleDragEvent(type, X, Y, event) {
        if (game.isDrawing) {
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
    function onMouseDown(event, X, Y) {
        game.canvas = document.getElementById("canvas");
        game.ctx = game.canvas.getContext("2d");
        game.ctx.lineCap = "round";
        game.currentDrawType = "onMouseDown";
        game.isMouseDown = true;
        var canvasX = game.canvas.offsetLeft;
        var canvasY = game.canvas.offsetTop;
        var x = Math.floor(X - canvasX);
        var y = Math.floor(Y - canvasY);
        if (game.isDrawing) {
            game.currentPoint = createPoint(x, y, game.currentDrawType);
            drawPoint(game.currentPoint);
            game.line.points.push(game.currentPoint);
        }
    }
    game.onMouseDown = onMouseDown;
    function onMouseMove(event, X, Y) {
        if (game.isMouseDown) {
            game.currentDrawType = "onMouseMove";
            var canvasX = game.canvas.offsetLeft;
            var canvasY = game.canvas.offsetTop;
            var x = Math.floor(X - canvasX);
            var y = Math.floor(Y - canvasY);
            if (game.isDrawing) {
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
                game.ctx.beginPath();
                game.ctx.moveTo(x, y);
                game.ctx.strokeStyle = point.colorStyle;
                game.ctx.lineWidth = point.sizeStyle;
                break;
            case "onMouseMove":
                game.ctx.lineTo(x, y);
                game.ctx.stroke();
                break;
        }
    }
    function onMouseUp() {
        game.isMouseDown = false;
    }
    game.onMouseUp = onMouseUp;
    function onMouseLeave() {
        game.isMouseDown = false;
    }
    game.onMouseLeave = onMouseLeave;
    function schedulePlay() {
        var tempLine = game.state.board;
        if (!tempLine.points[0]) {
            console.log("empty recording!");
            return false;
        }
        document.getElementById("Play").style.display = "none";
        clear();
        var startTime = tempLine.points[0].timestamp;
        var _loop_1 = function(i) {
            var temp = tempLine.points[i];
            game.timeoutList[i] = window.setTimeout(function () {
                drawPoint(temp);
            }, temp.timestamp - startTime);
        };
        for (var i in tempLine.points) {
            _loop_1(i);
        }
        window.setTimeout(function () { document.getElementById("Play").style.display = "inline-block"; }, tempLine.points[tempLine.points.length - 1].timestamp - startTime);
    }
    game.schedulePlay = schedulePlay;
    function setColor(colorVal) {
        emptyColorStyle();
        game.color = colorVal;
        document.getElementById(game.color + "box").style.border = "2.5px solid white";
    }
    game.setColor = setColor;
    function emptyColorStyle() {
        for (var i in game.colors) {
            document.getElementById(game.colors[i] + "box").style.border = "0px";
        }
    }
    function setSize(sizeVal) {
        emptySizeStyle();
        game.size = sizeVal;
        document.getElementById("size" + game.size).style.border = "2.5px solid black";
    }
    game.setSize = setSize;
    function emptySizeStyle() {
        for (var i in game.sizes) {
            document.getElementById("size" + game.sizes[i]).style.border = "0";
        }
    }
    function clear() {
        game.line.points = [];
        game.canvas = document.getElementById("canvas");
        game.ctx = game.canvas.getContext("2d");
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.width);
    }
    game.clear = clear;
    function drawFinish() {
        if (game.didMakeMove) {
            return;
        }
        if (!game.line.points[0]) {
            console.log("empty recording");
            return false;
        }
        game.didMakeMove = true;
        document.getElementById("message").innerHTML = "";
        game.isDrawing = false;
        var board = game.line;
        var newState = { board: board, answer: game.get_answer() };
        var nextMove = gameLogic.createMove(game.state, newState, game.currentUpdateUI.move.turnIndexAfterMove);
        makeMove(nextMove);
        clear();
        // isHolding = true;
        applyScope();
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
        if (next_avaliable_spot_num == game.state.answer.length)
            updateGuesserUI();
    }
    game.imgClicked = imgClicked;
    function get_word() {
        var word = "";
        for (var num in get_answer_nums()) {
            var parent_id = "u" + num;
            var ele = document.getElementById(parent_id).childNodes[0];
            var letter = ele.src.substring(ele.src.lastIndexOf("/")).substring(8, 9);
            word = word + letter;
        }
        return word;
    }
    function updateGuesserUI() {
        var word = get_word();
        var result = gameLogic.judge(word, game.state.answer);
        if (result) {
            for (var i in game.timeoutList) {
                window.clearTimeout(game.timeoutList[i]);
            }
            document.getElementById("message").innerHTML = "Message: Correct! The answer is\"" + word + "\"!";
            game.line.points = [];
            game.state.board.points = [];
            clear();
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
            game.isDrawing = !game.isDrawing;
            // isHolding = false;
            applyScope();
        }
    }
    game.updateGuesserUI = updateGuesserUI;
    function applyScope() {
        $rootScope.$apply();
    }
    function get_answer() {
        return gameLogic.answer;
    }
    game.get_answer = get_answer;
    function get_answer_nums() {
        var ans = game.state.answer;
        var answer_nums = [];
        for (var i = 0; i < ans.length; i++) {
            answer_nums.push(i);
        }
        return answer_nums;
    }
    game.get_answer_nums = get_answer_nums;
    function empty_blank() {
        var num = get_answer_nums().length - 1;
        while (num >= 0) {
            var parent_id = "u" + num;
            var img = document.getElementById(parent_id).childNodes[0];
            imgClicked(img);
            num = num - 1;
        }
    }
    game.isInstructionsShowing = false;
    function showInstructions() {
        game.isInstructionsShowing = true;
    }
    game.showInstructions = showInstructions;
    function hideInstructions() {
        game.isInstructionsShowing = false;
    }
    game.hideInstructions = hideInstructions;
    // update UI part
    game.currentUpdateUI = null;
    game.state = null;
    function init() {
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
                "en": "Sketch Uer Instructions",
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
    function updateUI(params) {
        log.info("Game got updateUI:", params);
        game.didMakeMove = false; // Only one move per updateUI
        game.currentUpdateUI = params;
        game.state = params.move.stateAfterMove;
        if (isFirstMove()) {
            game.isDrawing = true;
            game.state = gameLogic.getInitialState();
        }
        else {
            game.isDrawing = false;
            game.state = params.move.stateAfterMove;
            // isHolding = false;
            applyScope();
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
        return !game.didMakeMove &&
            game.currentUpdateUI.move.turnIndexAfterMove >= 0 &&
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