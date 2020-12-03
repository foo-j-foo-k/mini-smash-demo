var settingsSceneConfig = {
    preload: preload,
    create: create,
    update: update
};

var plusButton, minusButton, backButton;
var volumeText, onText, offText;
var swatches = new Array(5);
var settingsBackgroundSetup, settingsSetting;

function preload() {
    settingsBackgroundSetup = new BackgroundSetup(this);
    settingsBackgroundSetup.preload();
    this.load.image('plain-setting', `../../assets/${MINI_GAME}/setting-plain.png`);
    this.load.image('ms-logo', '../../assets/ms-logo.png');
    this.load.image('settings-text', '../../assets/settings-text.png');
    this.load.image('settings-content', '../../assets/settings.png');
    this.load.image('purple-swatch', '../../assets/background-tints/purple.png');
    this.load.image('blue-swatch', '../../assets/background-tints/blue.png');
    this.load.image('teal-swatch', '../../assets/background-tints/teal.png');
    this.load.image('brown-swatch', '../../assets/background-tints/brown.png');
    this.load.image('black-swatch', '../../assets/background-tints/black.png');
    this.load.spritesheet('button-back', '../../assets/buttons/button-back.png', { 
        frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('button-plus', '../../assets/buttons/button-plus.png', { 
        frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('button-minus', '../../assets/buttons/button-minus.png', { 
        frameWidth: 256, frameHeight: 256 });
}

function create() {
    settingsBackgroundSetup.create();
    
    settingsSetting = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'plain-setting');
    settingsSetting.setScale(gameWidth / settingsSetting.width);

    var logo = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.46, 'ms-logo');
    logo.setScale(gameWidth * 0.4 / logo.width);

    var helpText = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - gameHeight * 0.395, 'settings-text');
    helpText.setScale(gameHeight * 0.05 / helpText.height);

    var content = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'settings-content');
    content.setScale(gameWidth / content.width);

    onText = this.add.text(window.innerWidth / 2 - gameWidth * 0.12, window.innerHeight / 2 - gameHeight * 0.2, 'ON', { 
        fontFamily: 'VT323', 
        fontSize: '720px', 
        color: 'rgb(255, 255, 255)' 
    });
    onText.setScale(gameHeight * 0.06 / onText.height)
          .setOrigin(0.5, 0.5)
          .setAlpha(backgroundOn ? 1 : 0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              if (topScene == this.scene.key) {
                  setBackgroundOn();
              }
          });

    offText = this.add.text(window.innerWidth / 2 + gameWidth * 0.12, window.innerHeight / 2 - gameHeight * 0.2, 'OFF', { 
        fontFamily: 'VT323', 
        fontSize: '720px', 
        color: 'rgb(255, 255, 255)' 
    });
    offText.setScale(gameHeight * 0.06 / offText.height)
           .setOrigin(0.5, 0.5)
           .setAlpha(!backgroundOn ? 1 : 0.5)
           .setInteractive({ useHandCursor: true })
           .on('pointerdown', () => {
               if (topScene == this.scene.key) {
                   setBackgroundOff();
               }
           });

    var swatchImages = ['blue-swatch', 'teal-swatch', 'purple-swatch', 'brown-swatch', 'black-swatch'];
    for (i = 0; i < swatches.length; i++) {
        swatches[i] = this.add.image((window.innerWidth - gameWidth) / 2 + (i + 1) * gameWidth / 6, 
            window.innerHeight / 2 + gameHeight * 0, swatchImages[i]);
        swatches[i].setScale(gameWidth * (i == 2 ? 0.15 : 0.1) / swatches[i].width)
                   .setAlpha(i == 2 ? 1 : 0.3)
                   .setInteractive({ useHandCursor: true });
    }
    swatches[0].on('pointerdown', () => {
        if (topScene == this.scene.key) {
            setBackgroundTint(0, backgroundTints.BLUE);
        }
    });
    swatches[1].on('pointerdown', () => {
        if (topScene == this.scene.key) {
            setBackgroundTint(1, backgroundTints.TEAL);
        }
    });
    swatches[2].on('pointerdown', () => {
        if (topScene == this.scene.key) {
            setBackgroundTint(2, backgroundTints.PURPLE);
        }
    });
    swatches[3].on('pointerdown', () => {
        if (topScene == this.scene.key) {
            setBackgroundTint(3, backgroundTints.BROWN);
        }
    });
    swatches[4].on('pointerdown', () => {
        if (topScene == this.scene.key) {
            setBackgroundTint(4, backgroundTints.BLACK);
        }
    });

    volumeText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + gameHeight * 0.22, fxVolume, { 
        fontFamily: 'VT323', 
        fontSize: '720px', 
        color: 'rgb(255, 255, 255)' 
    });
    volumeText.setScale(gameWidth * 0.15 / volumeText.width)
              .setOrigin(0.5, 0.5);

    plusButton = new Button(this, window.innerWidth / 2 + gameWidth * 0.2, window.innerHeight / 2 + gameHeight * 0.22, 'button-plus', null);
    plusButton.setScale(gameWidth * 0.1 / plusButton.width);

    minusButton = new Button(this, window.innerWidth / 2 - gameWidth * 0.2, window.innerHeight / 2 + gameHeight * 0.22, 'button-minus', null);
    minusButton.setScale(gameWidth * 0.1 / minusButton.width);

    backButton = new Button(this, window.innerWidth / 2, window.innerHeight / 2 + gameHeight * 0.4, 'button-back', null);
    backButton.setScale(gameWidth * 0.2 / backButton.width);
}

function update() {
    settingsBackgroundSetup.update();

    if (backgroundOn && !settingsSetting.visible) {
        settingsSetting.setVisible(true);
    } else if (!backgroundOn && settingsSetting.visible) {
        settingsSetting.setVisible(false);
    }

    backButton.update();
    plusButton.update();
    minusButton.update();

	if (backButton.justPressed() && topScene == this.scene.key) {
        var nextScene = this.data.values.prevScene;
        game.scene.run(nextScene);
        game.scene.bringToTop(nextScene);
        topScene = nextScene;
	}

    if (plusButton.justPressed() && fxVolume <= 90 && topScene == this.scene.key) {
        fxVolume += 10;
        volumeText.setText(fxVolume);
    }

    if (minusButton.justPressed() && fxVolume >= 10 && topScene == this.scene.key) {
        fxVolume -= 10;
        volumeText.setText(fxVolume);
    }
}

function setBackgroundOn() {
    if (!backgroundOn) {
        backgroundOn = true;
        onText.setAlpha(1);
        offText.setAlpha(0.5);
    }
}

function setBackgroundOff() {
    if (backgroundOn) {
        backgroundOn = false;
        onText.setAlpha(0.5);
        offText.setAlpha(1);
    }
}

function setBackgroundTint(id, tint) {
    backgroundTint = tint;
    swatches.forEach(swatch => swatch.setAlpha(0.5).setScale(gameWidth * 0.1 / swatches[0].width));
    swatches[id].setAlpha(1).setScale(gameWidth * 0.15 / swatches[0].width);
}