var gameLogic;
(function (gameLogic) {
    gameLogic.endGame = false;
    gameLogic.level = 0;
    var answer_array = [
        "DOG", "LIP",
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
        var board = [];
        return board;
    }
    gameLogic.getInitialBoard = getInitialBoard;
    function getInitialState() {
        return { board: getInitialBoard() };
    }
    gameLogic.getInitialState = getInitialState;
    function createMove(stateBeforeMove, canvas, turnIndexBeforeMove) {
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        var board = stateBeforeMove.board;
        var boardAfterMove = angular.copy(board);
        // boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
        var endMatchScores;
        var turnIndexAfterMove;
        if (gameLogic.endGame) {
            turnIndexAfterMove = 1 - turnIndexBeforeMove;
            endMatchScores = null;
        }
        var stateAfterMove = { board: boardAfterMove };
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
        // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
        // to verify that the move is OK.
        var turnIndexBeforeMove = stateTransition.turnIndexBeforeMove;
        var stateBeforeMove = stateTransition.stateBeforeMove;
        var move = stateTransition.move;
        if (!stateBeforeMove && turnIndexBeforeMove === 0 &&
            angular.equals(createInitialMove(), move)) {
            return;
        }
        var expectedMove = createMove(stateBeforeMove, turnIndexBeforeMove);
        if (!angular.equals(move, expectedMove)) {
            throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
                ", but got stateTransition=" + angular.toJson(stateTransition, true));
        }
    }
    gameLogic.checkMoveOk = checkMoveOk;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map