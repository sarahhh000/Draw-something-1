var gameLogic;
(function (gameLogic) {
    gameLogic.endGame = false;
    gameLogic.level = 0;
    var answer_array = [
        "DOG", "LIP", "CAR", "ANT", "TOE", "BED",
        "GIFT", "LOVE", "FISH", "PEAR", "COLA", "HAIR", "DESK",
        "BIRD", "PLUG", "SNOW", "BIKE", "SALE", "WORD", "BATH",
        "FRIES", "MOUSE", "DANCE", "JEANS", "PIANO", "PHONE",
        "SHADOW", "HOLIDAY", "KETCHUP", "BIRTHDAY"
    ];
    gameLogic.answer = answer_array[gameLogic.level];
    // export let answer_nums: Array<number> = Array.from(answer.length.keys());
    gameLogic.answer_nums = [];
    for (var i = 0; i < gameLogic.answer.length; i++) {
        gameLogic.answer_nums.push(i);
    }
    function newRound() {
        gameLogic.level = gameLogic.level + 1;
        // no more words
        if (gameLogic.level == answer_array.length) {
            gameLogic.endGame = true;
            console.log("end game");
            return;
        }
        gameLogic.answer = answer_array[gameLogic.level];
        gameLogic.answer_nums = [];
        for (var i = 0; i < gameLogic.answer.length; i++) {
            gameLogic.answer_nums.push(i);
        }
        // answer_nums = Array.from(Array(answer.length).keys())
    }
    gameLogic.newRound = newRound;
    // judge if the guess correctly
    function judge(word) {
        if (word == gameLogic.answer) {
            return true;
        }
        else {
            return false;
        }
    }
    gameLogic.judge = judge;
    function getInitialBoard() {
        var board = { points: [] };
        return board;
    }
    gameLogic.getInitialBoard = getInitialBoard;
    function getInitialState() {
        return { board: getInitialBoard(), answer: gameLogic.answer };
    }
    gameLogic.getInitialState = getInitialState;
    function createMove(stateBeforeMove, board, turnIndexBeforeMove) {
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        var endMatchScores;
        var turnIndexAfterMove;
        if (!gameLogic.endGame) {
            turnIndexAfterMove = 1 - turnIndexBeforeMove;
            endMatchScores = null;
        }
        else {
            turnIndexAfterMove = -1;
            endMatchScores = null;
        }
        var boardAfterMove = angular.copy(board);
        var stateAfterMove = { board: boardAfterMove, answer: gameLogic.answer };
        return { endMatchScores: endMatchScores, turnIndexAfterMove: turnIndexAfterMove, stateAfterMove: stateAfterMove };
    }
    gameLogic.createMove = createMove;
    function createInitialMove() {
        return {
            endMatchScores: null, turnIndexAfterMove: 0,
            stateAfterMove: getInitialState()
        };
    }
    gameLogic.createInitialMove = createInitialMove;
    function checkMoveOk(stateTransition) {
    }
    gameLogic.checkMoveOk = checkMoveOk;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map