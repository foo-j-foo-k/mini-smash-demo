class BackgroundSetup {
	constructor(scene) {
		this.scene = scene;
	}

	preload() {
		this.scene.load.image('background', '../../assets/bg.jpg');
	}

	create() {
	    this.background = this.scene.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
	    const SCALE_X = window.innerWidth / this.background.width;
	    const SCALE_Y = window.innerHeight / this.background.height;
	    this.background.setScale(SCALE_X, SCALE_Y);
	}

	update() {
		if (!this.background.isTinted && backgroundTint == backgroundTints.PURPLE) {
		} else if (this.background.isTinted && backgroundTint == backgroundTints.PURPLE) {
			this.background.clearTint();
		} else if (backgroundTint != this.background.tint) {
			this.background.setTintFill(backgroundTint);
		}
	}
}