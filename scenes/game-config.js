/**
 * NOTE: No need to edit
 */
var gameConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    parent: 'game',
    physics: physicsConfig
};

var game = new Phaser.Game(gameConfig);

// Sets game width and height
const PORTRAIT = window.innerWidth < window.innerHeight;
const DIMENSIONS = 16 / 9;
var gameWidth, gameHeight;

if ((PORTRAIT && window.innerWidth * DIMENSIONS <= window.innerHeight) || 
    (!PORTRAIT && window.innerHeight / DIMENSIONS > window.innerWidth)) {
    gameWidth = window.innerWidth;
    gameHeight = window.innerWidth * DIMENSIONS;
} else {
    gameWidth = window.innerHeight / DIMENSIONS;
    gameHeight = window.innerHeight;
}

WebFontConfig = {
    google: {
      families: ['VT323']
    }
};

backgroundTints = {
    PURPLE: -1,
    BLUE: 290000,
    TEAL: 100000,
    BROWN: 5000000,
    BLACK: 0
};

fxVolume = 40;
backgroundOn = true;
backgroundTint = backgroundTints.PURPLE;
topScene = 'start-scene';