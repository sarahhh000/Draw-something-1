var gameLogic;
(function (gameLogic) {
    gameLogic.endGame = false;
    var answer_array = [
        "DOG", "LIP", "CAR", "ANT", "TOE", "BED",
        "GIFT", "LOVE", "FISH", "PEAR", "COLA", "HAIR", "DESK",
        "BIRD", "PLUG", "SNOW", "BIKE", "SALE", "WORD", "BATH",
        "FRIES", "MOUSE", "DANCE", "JEANS", "PIANO", "PHONE",
        "SHADOW", "HOLIDAY", "KETCHUP", "BIRTHDAY"
    ];
    function getRandomIndex() {
        return Math.floor(Math.random() * answer_array.length);
    }
    gameLogic.answer_nums = [];
    function newRound() {
        var index = getRandomIndex();
        gameLogic.answer = answer_array[index];
        gameLogic.answer_nums = [];
        for (var i = 0; i < gameLogic.answer.length; i++) {
            gameLogic.answer_nums.push(i);
        }
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
        newRound();
        return { board: getInitialBoard(), answer: gameLogic.answer };
    }
    gameLogic.getInitialState = getInitialState;
    function createMove(stateBeforeMove, board, turnIndexBeforeMove) {
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        var endMatchScores;
        var turnIndexAfterMove;
        turnIndexAfterMove = 1 - turnIndexBeforeMove;
        endMatchScores = null;
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