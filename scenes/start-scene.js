var startSceneConfig = {
    init: init,
    preload: preload,
    create: create,
    update: update
};

var spaceBar;
var playButton, helpButton, settingsButton;
var started = false;
var lastFrame;
var startBackgroundSetup;

function init(data) {
    lastFrame = data.lastFrame;
}

function preload() {
    startBackgroundSetup = new BackgroundSetup(this);
    startBackgroundSetup.preload();
    this.load.image('ms-logo', '../../assets/ms-logo.png');
    this.load.image('game-title', `../../assets/${MINI_GAME}/title.png`);
    this.load.spritesheet('how-to', `../../assets/${MINI_GAME}/how-to.png`, { 
        frameWidth: 1152, frameHeight: 2048 });
    this.load.spritesheet('button-play', '../../assets/buttons/button-play.png', { 
        frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('button-help', '../../assets/buttons/button-help.png', { 
        frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('button-settings', '../../assets/buttons/button-settings.png', { 
        frameWidth: 240, frameHeight: 240 });
    spaceBar = new StickyKey(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE));
    this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
}

function create() {
    startBackgroundSetup.create();
    
    var howTo = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'how-to');
    howTo.setScale(gameWidth / howTo.width);
    this.anims.create({
        key: 'how-to-anim',
        frames: this.anims.generateFrameNumbers('how-to', { start: 0, end: lastFrame }), 
        frameRate: 1, 
        repeat: -1
    });
    howTo.anims.play('how-to-anim');

    var logo = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.46, 'ms-logo');
    logo.setScale(gameWidth * 0.4 / logo.width);

    var gameTitle = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.36, 'game-title');
    gameTitle.setScale(gameHeight * 0.12 / gameTitle.height);

    // Creates start button
    playButton = new Button(this, window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.15, 'button-play', spaceBar);
    playButton.setScale(gameWidth * 0.2 / playButton.width);

    // Creates help button
    helpButton = new Button(this, window.innerWidth / 2 + gameWidth * 0.25, window.innerHeight / 2 - gameHeight * 0.15, 'button-help', null);
    helpButton.setScale(gameWidth * 0.14 / helpButton.width);

    // Creates settings button
    settingsButton = new Button(this, window.innerWidth / 2 - gameWidth * 0.25, window.innerHeight / 2 - gameHeight * 0.15, 'button-settings', null);
    settingsButton.setScale(gameWidth * 0.14 / settingsButton.width);
}

function update() {
    startBackgroundSetup.update();

    if (!started) {
        playButton.update();
        helpButton.update();

        // Starts mini-game when start button is pressed
    	if (playButton.justPressed() && topScene == this.scene.key) {
            started = true;
    		game.scene.run('game-scene');
            game.scene.bringToTop('game-scene');
            topScene = 'game-scene';
    	} else if (helpButton.justPressed() && topScene == this.scene.key) {
            game.scene.getScene('help-scene').data.set('prevScene', 'start-scene');
            game.scene.run('help-scene');
            game.scene.bringToTop('help-scene');
            topScene = 'help-scene';
        } else if (settingsButton.justPressed() && topScene == this.scene.key) {
            game.scene.getScene('settings-scene').data.set('prevScene', 'start-scene');
            game.scene.run('settings-scene');
            game.scene.bringToTop('settings-scene');
            topScene = 'settings-scene';
        }
    }
}
