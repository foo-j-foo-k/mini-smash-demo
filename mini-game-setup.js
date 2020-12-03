class MiniGameSetup {
	constructor(scene) {
		this.scene = scene;
		this.gameOver = false;
		this.puzzleCount = 0;
		this.puzzleSolved = false;
		this.puzzleLoading = true;
		this.PUZZLE_CORRECT = 1;
		this.PUZZLE_WRONG = 0;
	}

	preload() {
		this.backgroundSetup = new BackgroundSetup(this.scene);
		this.backgroundSetup.preload();
		this.scene.load.image('stopwatch-banner', '../../assets/stopwatch-banner.png');
	    this.scene.load.audio('nice-audio', '../../assets/sounds/nice-audio.m4a');
	    this.scene.load.audio('oopsy-audio', '../../assets/sounds/oopsy-audio.m4a');
	    this.scene.load.image('nice-text', '../../assets/nice-text.png');
	    this.scene.load.image('oops-text', '../../assets/oops-text.png');
	    this.scene.load.image('ready-text', '../../assets/ready-text.png');
	    this.scene.load.image('go-text', '../../assets/go-text.png');
	    this.scene.load.image('setting', `../../assets/${MINI_GAME}/setting.png`);
	    this.scene.load.spritesheet('button-red', '../../assets/buttons/button-red.png', { 
        	frameWidth: 1044, frameHeight: 940 });
    	this.scene.load.spritesheet('button-yellow', '../../assets/buttons/button-yellow.png', { 
        	frameWidth: 1044, frameHeight: 940 });
    	this.scene.load.spritesheet('button-blue', '../../assets/buttons/button-blue.png', { 
        	frameWidth: 1044, frameHeight: 940 });
	}

	create() {
		this.backgroundSetup.create();

	    this.gameSetting = this.scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'setting');
	    this.gameSetting.setScale(gameWidth / this.gameSetting.width);

    	this.cursors = new StickyCursorKeys(this.scene.input.keyboard.createCursorKeys());

		// Creates buttons
    	const BUTTON_X = window.innerWidth * 0.5;
    	const BUTTON_X_INT = gameWidth * 0.3;
	    const BUTTON_Y = window.innerHeight / 2 + gameHeight * 0.4;
	    const BUTTON_WIDTH = gameWidth * 0.2;
	    this.leftButton = new Button(this.scene, BUTTON_X - BUTTON_X_INT, BUTTON_Y, 'button-red', this.cursors.left);
	    this.midButton = new Button(this.scene, BUTTON_X, BUTTON_Y, 'button-yellow', this.cursors.down);
	    this.rightButton = new Button(this.scene, BUTTON_X + BUTTON_X_INT, BUTTON_Y, 'button-blue', this.cursors.right);
	    this.buttons = [this.leftButton, this.midButton, this.rightButton];
	    this.buttons.forEach(button => button.setScale(BUTTON_WIDTH / this.leftButton.width));

	    // Creates stopwatch
	    var stopwatchBanner = this.scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'stopwatch-banner');
	    stopwatchBanner.setScale(gameWidth / stopwatchBanner.width);
	    var stopwatchText = this.scene.add.text(window.innerWidth / 2, (window.innerHeight - gameHeight) / 2 + gameHeight / 7, '0.000s', { 
	        fontFamily: 'VT323', 
	        fontSize: '720px', 
	        color: 'rgb(116, 92, 135)' 
	    });
	    stopwatchText.setScale(gameWidth * 0.6 / stopwatchText.width)
	    			 .setOrigin(0.5, 0.5);
	    this.stopwatch = new Stopwatch(stopwatchText, PENALTY_TIME, TIME_LIMIT);

	    this.readyText = this.scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'ready-text');
	    this.readyText.setScale(gameHeight * 0.08 / this.readyText.height);
	    this.goText = this.scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'go-text');
	    this.goText.setScale(gameHeight * 0.08 / this.goText.height).setVisible(false);
	    this.readyTimer = this.scene.time.addEvent({
	        delay: 1000,
	        loop: true,
	        callback: this.ready.bind(this)
	    });
	    this.goTimer = this.scene.time.addEvent({
	        delay: 1000,
	        loop: true,
	        callback: this.go.bind(this), 
	        paused: true
	    });

	    this.nextPuzzleTimer = this.scene.time.addEvent({
	        delay: 500,
	        loop: true,
	        callback: this.nextPuzzle.bind(this),
	        paused: true
	    });

		this.emitter = new Phaser.Events.EventEmitter();
		this.emitter.on('nice', this.nice.bind(this), this.scene)
					.on('oops', this.oops.bind(this), this.scene);
		this.niceFx = this.scene.sound.add('nice-audio', { volume: fxVolume / 100 });
	    this.oopsyFx = this.scene.sound.add('oopsy-audio', { volume: fxVolume / 100 });
	}

	setInvisible(miniGameObjects) {
		this.miniGameObjects = miniGameObjects;
		this.miniGameObjects.forEach(obj => obj.setVisible(false));
	}

	update() {
		this.backgroundSetup.update();

		if (backgroundOn && !this.gameSetting.visible) {
	        this.gameSetting.setVisible(true);
	    } else if (!backgroundOn && this.gameSetting.visible) {
	        this.gameSetting.setVisible(false);
	    }

		this.leftButton.update();
        this.midButton.update();
        this.rightButton.update();
        this.cursors.resetAll();
	}

	ready() {
	    this.readyTimer.paused = true;
	    this.readyText.setVisible(false);
	    this.goText.setVisible(true);
	    this.goTimer.paused = false;
	    this.updateFxVolume();
	}

	go() {
	    this.goTimer.paused = true;
	    this.goText.setVisible(false);
	    this.miniGameObjects.forEach(obj => obj.setVisible(true));
	    this.puzzleSolved = true;
	    this.puzzleLoading = false;
	}

	nice() {
	    this.niceText = this.scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'nice-text');
	    this.niceText.setScale(gameHeight * 0.08 / this.niceText.height);
	}

	oops() {
		this.oopsText = this.scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'oops-text');
	    this.oopsText.setScale(gameHeight * 0.08 / this.oopsText.height);
	}

	ansCorrect() {
		if (topScene == this.scene.scene.key) {
			this.niceFx.play();
		    this.emitter.emit('nice');
		    this.nextPuzzleTimer.paused = false;
		    this.nextPuzzleTimer.args[0] = this.PUZZLE_CORRECT;
		}
	}

	ansWrong() {
		if (topScene == this.scene.scene.key) {
			this.oopsyFx.play();
		    this.emitter.emit('oops');
		    this.nextPuzzleTimer.paused = false;
		    this.nextPuzzleTimer.args[0] = this.PUZZLE_WRONG;
		    this.stopwatch.addPenalty();
		    this.stopwatch.updateStopwatch();
		}
	}

	nextPuzzle() {
	    this.nextPuzzleTimer.paused = true;
	    if (this.nextPuzzleTimer.args[0] == this.PUZZLE_CORRECT) {
	        this.niceText.destroy(this.scene);
	    } else if (this.nextPuzzleTimer.args[0] == this.PUZZLE_WRONG) {
	        this.oopsText.destroy(this.scene);
	    }
	    this.puzzleSolved = true;
	    this.puzzleLoading = false;
	}

	setGameOver() {
	    this.gameOver = true;
	    game.scene.getScene('game-over-scene').data.set('score', this.calculateScore());
	    game.scene.run('game-over-scene');
	    game.scene.bringToTop('game-over-scene');
	    topScene = 'game-over-scene';
	}

	calculateScore() {
	    return Math.round((1 - this.stopwatch.timeSoFar / TIME_LIMIT) * 100);
	}

	resetGame() {
		this.gameOver = false;
	    this.puzzleCount = 0;
	    this.puzzleSolved = false;
	    this.stopwatch.reset();
	    this.readyText.setVisible(true);
	    this.readyTimer.paused = false;
		this.miniGameObjects.forEach(obj => obj.setVisible(false));
	}

	updateFxVolume() {
		this.niceFx.volume = fxVolume / 100;
		this.oopsyFx.volume = fxVolume / 100;
	}
} 