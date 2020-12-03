/**
 * Represents an input from the keyboard where a long, continuous keypress is 
 *     considered one keypress.
 */
class StickyKey {
	constructor(key) {
		this.key = key;
		this.switch = false;
	}

	idle() {
		return this.key.isUp;	
	}

	pressed() {
		return this.key.isDown;
	}

	/**
	 * Checks for the start of a keypress.
	 * @return {boolean} true if key has just been pressed, false otherwise
	 */
	justPressed() {
		if (this.pressed()) {
			const temp = !this.switch;
			this.alreadyPressed();
			return temp;
		}
		return false;
	}

	/**
	 * Updates the switch to reflect that a keypress has already started.
	 */
	alreadyPressed() {
		this.switch = true;
	}

	/**
	 * Resets the switch when a keypress ends.
	 */
	reset() {
		if (this.idle()) {
			this.switch = false;
		}
	}
}