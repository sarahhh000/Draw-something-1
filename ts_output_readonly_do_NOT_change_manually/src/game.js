;
var game;
(function (game) {
    // turn: true: guess, false: draw
    game.turn = true;
    function drawFinish(canvas) {
        console.log("click submit");
        var nextMove = gameLogic.createMove(game.state, canvas, game.currentUpdateUI.move.turnIndexAfterMove);
        makeMove(nextMove);
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
            var letter = ele.src.substring(61, 62);
            word = word + letter;
        }
        return word;
    }
    function updateGuesserUI() {
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
        resizeGameAreaService.setWidthToHeight(0.5);
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
            game.state = gameLogic.getInitialState();
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