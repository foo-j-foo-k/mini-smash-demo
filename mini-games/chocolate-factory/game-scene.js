var chocolateFactoryGameConfig = {
    preload: preload,
    create: create,
    update: update
};

const PUZZLE_MAX_COUNT = 8;
const PENALTY_TIME = 5000;
const TIME_LIMIT = 60000;

const CHOC_WIDTH = gameWidth * 0.25;
const CHOC_X = window.innerWidth * 0.5 - CHOC_WIDTH;
const CHOC_Y = (window.innerHeight - gameHeight) / 2 + gameHeight * 0.55 - CHOC_WIDTH;
var chocs = Array.from(Array(3), () => new Array(3));;
var chocScale, numOfChoc, bittenChoc;

var ansBegun = false;
var puzzleAns = new Array(3);
var userAns = new Array(3);
var puzzleChocs = [];
var userAnsChocs = [];

var dropChocsTimer, dropRowTimer, checkAnsTimer, biteChocTimer;

var emitter;

function preload() {
    miniGameSetup = new MiniGameSetup(this);
    miniGameSetup.preload();
    this.load.image('choc-opaque', '../../assets/chocolate-factory/choc-opaque.png');
    this.load.image('choc-trans', '../../assets/chocolate-factory/choc-trans.png');
    this.load.image('choc-bite', '../../assets/chocolate-factory/choc-bite.png');
}

function create() {
    miniGameSetup.create();

    // Creates chocolate
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            chocs[i][j] = this.add.image(CHOC_X + j * CHOC_WIDTH, CHOC_Y + i * CHOC_WIDTH, 'choc-trans');
            if (chocScale == null) {
                chocScale = CHOC_WIDTH / chocs[i][j].width;
            }
            chocs[i][j].setScale(chocScale);
        }
    }

    var miniGameObjects = new Array();
    chocs.forEach(row => row.forEach(choc => miniGameObjects.push(choc)));
    miniGameSetup.setInvisible(miniGameObjects);

    emitter = new Phaser.Events.EventEmitter();
    emitter.on('createChoc', createChoc, this)
           .on('clearChocs', clearChocs, this)
           .on('biteChoc', biteChoc, this);

    dropChocsTimer = this.time.addEvent({
        delay: 1500,
        loop: true,
        callback: dropChocs,
        paused: true
    });

    dropRowTimer = this.time.addEvent({
        delay: 50,
        loop: true,
        callback: dropRow,
        paused: true
    });

    checkAnsTimer = this.time.addEvent({
        delay: 500,
        loop: true,
        callback: checkAns,
        paused: true
    });

    biteChocTimer = this.time.addEvent({
        delay: 500,
        loop: true,
        callback: destroyBiteChoc,
        paused: true
    });
}

function update() {
    if (!miniGameSetup.gameOver) { 
        miniGameSetup.update();
        
        // Stops game after 60 seconds if not completed
        if (miniGameSetup.stopwatch.checkOverTime()) {
            miniGameSetup.stopwatch.stop();
            miniGameSetup.setGameOver();
        // Stops game if all puzzles have been solved
        } else if (miniGameSetup.puzzleCount >= PUZZLE_MAX_COUNT && miniGameSetup.puzzleSolved) {
            miniGameSetup.setGameOver();
        } else if (miniGameSetup.puzzleSolved) {
            setPuzzle();
            miniGameSetup.stopwatch.start();
        // .......
        } else if (!miniGameSetup.puzzleLoading && dropRowTimer.paused 
            && checkAnsTimer.paused && ansGiven() && !ansBegun) {
            miniGameSetup.stopwatch.stop();
            dropChocsTimer.paused = false;
            ansBegun = true;
        }
    }
}

/**
 * Sets new puzzle.
 */
function setPuzzle() {
    function arraySum(arr) {
        return arr.reduce((x, y) => x + y, 0);
    }

    const MAX_TOTAL_CHOC = 8;
    const MIN_CHOC = 1;
    const MAX_CHOC = 3;
    numOfChoc = [];
    while (numOfChoc.length < 3) {
        numOfChoc.push(Phaser.Math.Between(MIN_CHOC, MAX_CHOC));
    }

    userAns.fill(0);
    emitter.emit('clearChocs');

    if (arraySum(numOfChoc) > MAX_TOTAL_CHOC) {
        var subtractIndex = Phaser.Math.Between(0, 2);
        if (numOfChoc[subtractIndex] > MIN_CHOC) {
            numOfChoc[subtractIndex]--;
        }
    }

    for (col = 0; col < 3; col++) {
        puzzleAns[col] = MAX_CHOC - numOfChoc[col];
        var temp = numOfChoc[col];
        var row = 2;
        while (temp > 0) {
            emitter.emit('createChoc', puzzleChocs, null, col, CHOC_Y + row * CHOC_WIDTH);
            temp--;
            row--;
        }
    }

    miniGameSetup.puzzleCount++;
    ansBegun = false;
    miniGameSetup.puzzleSolved = false;
}

/**
 * Checks if user has given an answer to the puzzle and updates user's answer.
 * @return {boolean} true if any button has been pressed, false otherwise
 */
function ansGiven() {
    var result = false;
    for (col = 0; col < chocs.length; col++) {
        if (miniGameSetup.buttons[col].justPressed()) {
            emitter.emit('createChoc', userAnsChocs, userAns[col], col, 
                (window.innerHeight - gameHeight + (userAns[col] * 2 + 1) * CHOC_WIDTH) / 2);
            userAns[col]++;
            result = true;
        }
        if (userAns[col] > puzzleAns[col]) {
            miniGameSetup.puzzleLoading = true;
            checkAns();
            dropChocsTimer.paused = true;
            dropChocsTimer.elapsed = 0;
            break;
        }
    }
    return result;
}

function createChoc(group, row, col, y) {
    var choc = this.matter.add.image(CHOC_X + col * CHOC_WIDTH, y, 'choc-opaque');
    choc.setStatic(true).setScale(chocScale);
    if (row == null) {
        group.push(choc);
    } else if (group.length <= row) {
        group.push([choc]);
    } else {
        group[row].push(choc);
    }
}

function clearChocs() {
    puzzleChocs.forEach(choc => {
        choc.setVisible(false);
        this.matter.world.remove(choc);
    });
    userAnsChocs.forEach(row => row.forEach(choc => {
        choc.setVisible(false);
        this.matter.world.remove(choc);
    }));
}

function dropChocs() {
    miniGameSetup.puzzleLoading = true;
    dropChocsTimer.paused = true;
    dropRowTimer.args[0] = userAnsChocs.length;
    dropRowTimer.paused = false;
}

function dropRow() {
    dropRowTimer.paused = true;
    dropRowTimer.args[0]--;
    userAnsChocs[dropRowTimer.args[0]].forEach(choc => choc.setStatic(false));
    if (dropRowTimer.args[0] > 0) {
        dropRowTimer.paused = false;
    } else {
        checkAnsTimer.paused = false;
    }
}

/**
 * Checks if answer given is correct and plays corresponding sound effect. Adds time 
 *     penalty to stopwatch if incorrect.
 */
function checkAns() {
    function arrEquals(arr1, arr2) {
        if (arr1.length != arr2.length) {
            return false;
        }
        for (i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    }
    checkAnsTimer.paused = true;

    if (arrEquals(userAns, puzzleAns)) {
        emitter.emit('clearChocs');
        emitter.emit('biteChoc');
        biteChocTimer.paused = false;
        miniGameSetup.ansCorrect();
    } else {
        miniGameSetup.ansWrong();
    }
}

function biteChoc() {
    bittenChoc = this.add.image(window.innerWidth / 2, CHOC_Y + CHOC_WIDTH, 'choc-bite');
    bittenChoc.setScale(3 * CHOC_WIDTH / bittenChoc.width);
}

function destroyBiteChoc() {
    biteChocTimer.paused = true;
    bittenChoc.destroy();
}

function resetGame() {
    miniGameSetup.resetGame();
    userAnsChocs = [];
}