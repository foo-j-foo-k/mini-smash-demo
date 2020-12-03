var sizeMattersGameConfig = {
    preload: preload,
    create: create,
    update: update
};

const PUZZLE_MAX_COUNT = 15;
const PENALTY_TIME = 3000;
const TIME_LIMIT = 60000;

var puzzleAns = 0;
var icePopScale;
var left, middle, right;
var objButPairs = [];

function preload() {
    miniGameSetup = new MiniGameSetup(this);
    miniGameSetup.preload();
    this.load.image('icepop-red', '../../assets/size-matters/icepop-red.png');
    this.load.image('icepop-yellow', '../../assets/size-matters/icepop-yellow.png');
    this.load.image('icepop-blue', '../../assets/size-matters/icepop-blue.png');
}

function create() {
    miniGameSetup.create();

    // Creates ice pops
    const ICE_POP_X = window.innerWidth * 0.5;
    const ICE_POP_X_INT = gameWidth * 0.3;
    const ICE_POP_Y = window.innerHeight / 2 + gameHeight * 0.1;
    const ICE_POP_WIDTH = gameWidth * 0.3;
    var leftIcePop = this.add.image(ICE_POP_X - ICE_POP_X_INT, ICE_POP_Y, 'icepop-red');
    var midIcePop = this.add.image(ICE_POP_X, ICE_POP_Y, 'icepop-yellow');
    var rightIcePop = this.add.image(ICE_POP_X + ICE_POP_X_INT, ICE_POP_Y, 'icepop-blue');
    icePopScale = ICE_POP_WIDTH / leftIcePop.width;

    left = new ObjectButtonPair(leftIcePop, miniGameSetup.leftButton);
    middle = new ObjectButtonPair(midIcePop, miniGameSetup.midButton);
    right = new ObjectButtonPair(rightIcePop, miniGameSetup.rightButton);
    objButPairs = [left, middle, right];

    var miniGameObjects = [leftIcePop, midIcePop, rightIcePop];
    miniGameSetup.setInvisible(miniGameObjects);
}

function update() {
    if (!miniGameSetup.gameOver) { 
        miniGameSetup.update();

        // Stops game after 60 seconds if not completed
        if (miniGameSetup.stopwatch.checkOverTime()) {
            miniGameSetup.stopwatch.stop();
            miniGameSetup.setGameOver();
        // Stops game if 10 puzzles have been solved
        } else if (miniGameSetup.puzzleCount >= PUZZLE_MAX_COUNT && miniGameSetup.puzzleSolved) {
            miniGameSetup.setGameOver();
        } else if (miniGameSetup.puzzleSolved) {
            setPuzzle();
            miniGameSetup.stopwatch.start();
        } else if (!miniGameSetup.puzzleLoading && ansGiven()) {
            miniGameSetup.puzzleLoading = true;
            miniGameSetup.stopwatch.stop();
            checkAns();
        }
    }
}

/**
 * Sets new puzzle.
 */
function setPuzzle() {
    const MIN_SIZE = 3;
    const MAX_SIZE = 7;
    var sizes = new Set();
    while (sizes.size < 3) {
        sizes.add(Phaser.Math.Between(MIN_SIZE, MAX_SIZE));
    }
    sizes = Array.from(sizes);
    puzzleAns = Math.max(...sizes) / MAX_SIZE * icePopScale;
    for (i = 0; i < sizes.length; i++) {
        objButPairs[i].setSize(sizes[i] / MAX_SIZE * icePopScale);
    }
    miniGameSetup.puzzleCount++;
    miniGameSetup.puzzleSolved = false;
}

/**
 * Checks if user has given an answer to the puzzle.
 * @return {boolean} true if any button has been pressed, false otherwise
 */
function ansGiven() {
    return miniGameSetup.leftButton.justPressed() || miniGameSetup.midButton.justPressed() || miniGameSetup.rightButton.justPressed();
}

/**
 * Checks if answer given is correct and plays corresponding sound effect. Adds time 
 *     penalty to stopwatch if incorrect.
 */
function checkAns() {
    if (left.isCorrect(puzzleAns) && middle.isCorrect(puzzleAns) &&
        right.isCorrect(puzzleAns)) {
        miniGameSetup.ansCorrect();
    } else {
        miniGameSetup.ansWrong();
    }
}

function resetGame() {
    miniGameSetup.resetGame();
}