var gameOverConfig = {
    preload: preload,
    create: create,
    update: update
};

var gameOverBackgroundSetup, gameOverSetting;
var replayButton, helpButton, settingsButton;

function preload() {
    gameOverBackgroundSetup = new BackgroundSetup(this);
    gameOverBackgroundSetup.preload();
    this.load.image('plain-setting', `../../assets/${MINI_GAME}/setting-plain.png`);
    this.load.image('ms-logo', '../../assets/ms-logo.png');
    this.load.image('game-title', `../../assets/${MINI_GAME}/title.png`);
    this.load.image('score-banner', '../../assets/score-banner.png');
    this.load.spritesheet('button-replay', '../../assets/buttons/button-replay.png', { 
        frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('button-help', '../../assets/buttons/button-help.png', { 
        frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('button-settings', '../../assets/buttons/button-settings.png', { 
        frameWidth: 240, frameHeight: 240 });
}

function create() {
    gameOverBackgroundSetup.create();

    gameOverSetting = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'plain-setting');
    gameOverSetting.setScale(gameWidth / gameOverSetting.width);

    var logo = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.46, 'ms-logo');
    logo.setScale(gameWidth * 0.4 / logo.width);

    var gameTitle = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.36, 'game-title');
    gameTitle.setScale(gameHeight * 0.12 / gameTitle.height);

    var scoreBanner = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'score-banner');
    scoreBanner.setScale(gameWidth / scoreBanner.width);

    var gameOverText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.15, 'GAME OVER', { 
        fontFamily: 'VT323', 
        fontSize: '720px', 
        color: 'rgb(116, 92, 135)' 
    });
    gameOverText.setScale(gameWidth * 0.8 / gameOverText.width);

    var score = this.data.values.score;
    var scoreText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.05, 'Score:', { 
        fontFamily: 'VT323', 
        fontSize: '720px', 
        color: 'rgb(116, 92, 135)'
    });
    scoreText.setScale(gameWidth * 0.3 / scoreText.width);

    var scoreNumText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + gameHeight * 0.08, score, { 
        fontFamily: 'VT323', 
        fontSize: '720px', 
        color: 'rgb(116, 92, 135)'
    });
	scoreNumText.setScale(gameHeight * 0.3 / scoreNumText.height);

    var textGroup = [gameOverText, scoreText, scoreNumText];
    textGroup.forEach(text => text.setOrigin(0.5, 0.5));

    replayButton = new Button(this, window.innerWidth / 2, window.innerHeight / 2 + gameHeight * 0.4, 'button-replay', spaceBar);
    replayButton.setScale(gameWidth * 0.2 / replayButton.width);

    // Creates help button
    helpButton = new Button(this, window.innerWidth / 2 + gameWidth * 0.25, window.innerHeight / 2 + gameHeight * 0.4, 'button-help', null);
    helpButton.setScale(gameWidth * 0.14 / helpButton.width);

    // Creates settings button
    settingsButton = new Button(this, window.innerWidth / 2 - gameWidth * 0.25, window.innerHeight / 2 + gameHeight * 0.4, 'button-settings', null);
    settingsButton.setScale(gameWidth * 0.14 / settingsButton.width);
}

function update() {
    gameOverBackgroundSetup.update();

    if (backgroundOn && !gameOverSetting.visible) {
        gameOverSetting.setVisible(true);
    } else if (!backgroundOn && gameOverSetting.visible) {
        gameOverSetting.setVisible(false);
    }

    replayButton.update();

    // Restarts mini-game when replay button is pressed
	if (replayButton.justPressed() && topScene == this.scene.key) {
        scorePosted = false;
        game.scene.run('game-scene');
		game.scene.bringToTop('game-scene');
        topScene = 'game-scene';
		resetGame();
    } else if (helpButton.justPressed() && topScene == this.scene.key) {
        game.scene.getScene('help-scene').data.set('prevScene', 'game-over-scene');
        game.scene.run('help-scene');
        game.scene.bringToTop('help-scene');
        topScene = 'help-scene';
    } else if (settingsButton.justPressed() && topScene == this.scene.key) {
        game.scene.getScene('settings-scene').data.set('prevScene', 'game-over-scene');
        game.scene.run('settings-scene');
        game.scene.bringToTop('settings-scene');
        topScene = 'settings-scene';
	}
}
