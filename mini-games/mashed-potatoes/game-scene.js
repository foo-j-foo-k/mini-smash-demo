var mashedPotatoesGameConfig = {
    preload: preload,
    create: create,
    update: update
};

const PUZZLE_MAX_COUNT = 10;
const PENALTY_TIME = 0;
const TIME_LIMIT = 120000;

var puzzleAns = 0;
var potato, potatoScale;
var potatoState = 0;
var masher;
const FINISHED = 5;

function preload() {
    miniGameSetup = new MiniGameSetup(this);
    miniGameSetup.preload();
    this.load.spritesheet('potato', '../../assets/mashed-potatoes/potato.png', {
        frameWidth: 342, frameHeight: 232 });
    this.load.image('masher', '../../assets/mashed-potatoes/masher.png');
}

function create() {
    miniGameSetup.create();

    // Creates potato
    const POTATO_WIDTH = gameWidth * 0.5;
    potato = this.physics.add.sprite(window.innerWidth * 0.5, window.innerHeight * 0.5 + gameHeight * 0.2, 'potato');
    potatoScale = POTATO_WIDTH / potato.width;
    potato.setScale(potatoScale);
    potato.setBounce(0.0);
    potato.setCollideWorldBounds(true);
    this.anims.create({
            key: 'state-0',
            frames: this.anims.generateFrameNumbers('potato', { start: 0, end: 0 })
    });
    this.anims.create({
            key: 'state-1',
            frames: this.anims.generateFrameNumbers('potato', { start: 1, end: 1 })
    });
    this.anims.create({
            key: 'state-2',
            frames: this.anims.generateFrameNumbers('potato', { start: 2, end: 2 })
    });
    this.anims.create({
            key: 'state-3',
            frames: this.anims.generateFrameNumbers('potato', { start: 3, end: 3 })
    });
    this.anims.create({
            key: 'state-4',
            frames: this.anims.generateFrameNumbers('potato', { start: 4, end: 4 })
    });
    this.anims.create({
            key: 'state-5',
            frames: this.anims.generateFrameNumbers('potato', { start: 5, end: 5 })
    });

    // Creates masher
    masher = this.physics.add.image(window.innerWidth * 0.5, window.innerHeight * 0.5 - gameHeight * 0.25, 'masher');
    masher.setScale(potatoScale);

    var miniGameObjects = [potato, masher];
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
        } else if (!miniGameSetup.puzzleLoading && mashed() && potatoState != 0) {
            masherUp();
            miniGameSetup.stopwatch.stop();
            checkMashed();
            miniGameSetup.stopwatch.start();
        } else if (!miniGameSetup.puzzleLoading && pressed() && potatoState != 0) {
            masherDown();
        // Stops potato at final height and peels potato
        } else if (potato.y >= (window.innerHeight * 0.5 +  gameHeight * 0.15) && potatoState == 0) {
            peel();
        // Stops masher from moving upwards
        } else if (masher.y <= window.innerHeight * 0.5 - gameHeight * 0.25 && masher.body.velocity.y < 0) {
            masher.setVelocityY(0);
        }
    }
}

/**
 * Sets new puzzle.
 */
function setPuzzle() {
    // Resets potato
    potatoState = 0;
    potato.anims.play('state-0', true);
    potato.setY(window.innerHeight * 0.5 - gameHeight * 0.3);

    // Drops potato
    potato.setVelocityY(1000); 

    miniGameSetup.puzzleCount++;
    miniGameSetup.puzzleSolved = false;
}


/**
 * Removes potato skin.
 */
function peel() {
    potato.setVelocityY(0);
    potato.setY(window.innerHeight * 0.5 + gameHeight * 0.15);
    potatoState = 1;
    potato.anims.play('state-1', true);
 }

/**
 * Moves masher down.
 */
function masherDown() {
    masher.setVelocityY(1000);
}

/**
 * Moves masher up when masher reaches potato.
 */
function masherUp() {
    mashPotato();
    masher.setVelocityY(-1000);
}

/**
 * Sets potato to next frame when mashed.
 */
function mashPotato() {
    potatoState++;
    potato.anims.play('state-' + potatoState, true);
}

/**
 * Checks if masher has reached potato.
 * @return {boolean} true if any masher has reached potato, false otherwise
 */
function mashed() {
    if (potatoState == 1) {
        return masher.y >= (window.innerHeight - gameHeight) / 2 + gameHeight * 0.3;
    } else if (potatoState == 2) {
        return masher.y >= (window.innerHeight - gameHeight) / 2 + gameHeight * 0.35;
    } else if (potatoState == 3) {
        return masher.y >= (window.innerHeight - gameHeight) / 2 + gameHeight * 0.38;
    } else if (potatoState == 4) {
        return masher.y >= (window.innerHeight - gameHeight) / 2 + gameHeight * 0.4;
    }
}

/**
 * Checks if user has pressed a button.
 * @return {boolean} true if any button has been pressed, false otherwise
 */
function pressed() {
    return miniGameSetup.leftButton.justPressed() || miniGameSetup.midButton.justPressed() || miniGameSetup.rightButton.justPressed();
}

/**
 * Checks if potato is fully mashed.
 */
function checkMashed() {
    if (potatoState == FINISHED) {
        miniGameSetup.puzzleLoading = true;
        miniGameSetup.ansCorrect();
    }
}

function resetGame() {
    miniGameSetup.resetGame();
}