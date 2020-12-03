var helpSceneConfig = {
    preload: preload,
    create: create,
    update: update
};

var backButton;
var helpSetting;
var helpBackgroundSetup;

function preload() {
    helpBackgroundSetup = new BackgroundSetup(this);
    helpBackgroundSetup.preload();
    this.load.image('background', '../../assets/bg.jpg');
    this.load.image('plain-setting', `../../assets/${MINI_GAME}/setting-plain.png`);
    this.load.image('ms-logo', '../../assets/ms-logo.png');
    this.load.image('help-text', '../../assets/help-text.png');
    this.load.image('help-content', '../../assets/help.png');
    this.load.image('link', '../../assets/help-hyperlink.png');
    this.load.spritesheet('button-back', '../../assets/buttons/button-back.png', { 
        frameWidth: 256, frameHeight: 256 });
}

function create() {
    helpBackgroundSetup.create();
    
    helpSetting = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'plain-setting');
    helpSetting.setScale(gameWidth / helpSetting.width);

    var logo = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.46, 'ms-logo');
    logo.setScale(gameWidth * 0.4 / logo.width);

    var helpText = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.395, 'help-text');
    helpText.setScale(gameHeight * 0.05 / helpText.height);

    var content = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'help-content');
    content.setScale(gameWidth / content.width);

    var bugLink = this.add.image(window.innerWidth / 2 + gameWidth * 0.33, window.innerHeight / 2 + gameHeight * 0.18, 'link');
    bugLink.setScale(gameWidth * 0.12 / bugLink.width)
           .setInteractive({ useHandCursor: true })
           .on('pointerdown', () => {
               if (topScene == this.scene.key) {
                   window.open('https://tinyurl.com/mini-smash-bug');
               }
           });

    var rateLink = this.add.image(window.innerWidth / 2 + gameWidth * 0.32, window.innerHeight / 2 + gameHeight * 0.25, 'link');
    rateLink.setScale(gameWidth * 0.12 / rateLink.width)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                if (topScene == this.scene.key) {
                    window.open('https://tinyurl.com/mini-smash-rate');
                }
            });

    backButton = new Button(this, window.innerWidth / 2, window.innerHeight / 2 + gameHeight * 0.4, 'button-back', null);
    backButton.setScale(gameWidth * 0.2 / backButton.width);
}

function update() {
    helpBackgroundSetup.update();

    if (backgroundOn && !helpSetting.visible) {
        helpSetting.setVisible(true);
    } else if (!backgroundOn && helpSetting.visible) {
        helpSetting.setVisible(false);
    }

    backButton.update();

	if (backButton.justPressed() && topScene == this.scene.key) {
        var nextScene = this.data.values.prevScene;
        game.scene.run(nextScene);
        game.scene.bringToTop(nextScene);
        topScene = nextScene;
    }
}