/**
 * Represents cursor keys as a group of sticky keys.
 */
class StickyCursorKeys {
	constructor(cursorKeys) {
		this.left = new StickyKey(cursorKeys.left);
		this.right = new StickyKey(cursorKeys.right);
		this.up = new StickyKey(cursorKeys.up);
		this.down = new StickyKey(cursorKeys.down);
	}

	resetAll() {
		this.left.reset();
		this.right.reset();
		this.up.reset();
		this.down.reset();
	}
}