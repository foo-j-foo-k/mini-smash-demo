/**
 * Represents a button, pressed via a touchscreen or a sticky key. 
 */
class Button extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, stickyKey) {
		// Creates and adds button sprite to given scene
		super(scene, x, y, texture);
		scene.add.existing(this);

		// Creates animations for button sprite
		scene.anims.create({
	        key: 'idle-' + texture,
	        frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: 0 })
	    });
	    scene.anims.create({
	        key: 'pressed-' + texture,
	        frames: scene.anims.generateFrameNumbers(texture, { start: 1, end: 1 })
	    });

	    this.name = texture;
		this.stickyKey = stickyKey;
		this.isTapped = false;
		this.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => this.isTapped = true)
			.on('pointerup', () => this.isTapped = false);
		this.tapSwitch = false;
	}

	idle() {
		return this.stickeyKey == null ? !this.isTapped : this.stickyKey.idle() && !this.isTapped;
	}

	pressed() {
		return this.stickyKey?.pressed() || this.isTapped;
	}

	/**
	 * Checks for the start of a tap on a touchscreen.
	 * @return {boolean} true if tap has just started, false otherwise
	 */
	justTapped() {
		if (this.isTapped) {
			const temp = !this.tapSwitch;
			this.alreadyTapped();
			return temp;
		}
		return false;
	}

	/**
	 * Updates the switch to reflect that a tap has already started.
	 */
	alreadyTapped() {
		this.tapSwitch = true;
	}

	/**
	 * Resets the switch when a tap ends.
	 */
	resetTap() {
		if (!this.isTapped) {
			this.tapSwitch = false;
		}
	}

	/**
	 * Checks for the start of a keypress of the sticky key or a tap on a touchscreen.
	 * @return {boolean} true if keypress or tap has just started, false otherwise
	 */
	justPressed() {
		return this.stickyKey?.justPressed() || this.justTapped();
	}

	/**
	 * Plays the corresponding animation of the button's pressed or idle state.
	 */
	update() {
		this.resetTap();
		if (this.pressed()) {
			this.anims.play('pressed-' + this.name);
		} else {
			this.anims.play('idle-' + this.name);
		}
	}
}