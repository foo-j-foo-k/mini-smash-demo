/**
 * Represents an object and a corresponding button in the Size Matters mini-game.
 */
class ObjectButtonPair {
	constructor(object, button) {
		this.object = object;
		this.button = button;
		this.size = 0;
	}

	/**
	 * Scales the object by the given size.
	 * @param {number} size - Size to scale object by
	 */
	setSize(size) {
		this.size = size;
		this.object.setScale(this.size);
	}

	/**
	 * Checks if object is the biggest.
	 * @param {number} biggest - Size of the biggest object
	 * @return {boolean} true if object is the biggest, false otherwise
	 */
	isBiggest(biggest) {
		return this.size == biggest;
	}

	/**
	 * Checks if button has been correctly pressed.
	 * @param {number} biggest - Size of the biggest object
	 * @return {boolean} true if object is the biggest and button is pressed, or object is not the 
	       biggest and button is not pressed, false otherwise
	 */
	isCorrect(biggest) {
		return this.isBiggest(biggest) ? this.button.pressed() : this.button.idle();
	}
}