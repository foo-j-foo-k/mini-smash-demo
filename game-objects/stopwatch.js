/**
 * Represents a stopwatch.
 */
class Stopwatch {
	constructor(stopwatchText, PENALTY_TIME, TIME_LIMIT) {
		this.stopwatchText = stopwatchText;
		this.PENALTY_TIME = PENALTY_TIME;
		this.TIME_LIMIT = TIME_LIMIT;
		this.startTime;
		this.updateInterval;
		this.timeSoFar = 0;
	}

	addPenalty() {
		this.timeSoFar += this.PENALTY_TIME;
	}

	start() {
		this.startTime = new Date().getTime();
		this.updateInterval = setInterval(this.updateStopwatch.bind(this), 50);
	}

	stop() {
	    clearInterval(this.updateInterval);
	    this.isRunning = false;
	}

	reset() {
		this.timeSoFar = 0;
	}
	
	checkOverTime() {
		return this.timeSoFar >= this.TIME_LIMIT;
	}

	/**
	 * Updates the stopwatch text to reflect the time passed on the stopwatch.
	 */
	updateStopwatch() {
		// Calculates the amount of time passed
		const currTime = new Date().getTime();
		this.timeSoFar += currTime - this.startTime;
		this.startTime = currTime;
		// Caps the amound of time passed at the maximum time limit
		if (this.timeSoFar >= this.TIME_LIMIT) {
			this.timeSoFar = this.TIME_LIMIT;
		}
		// Formats stopwatch text to display as 'S.MMMs'
		const seconds = Math.floor(this.timeSoFar / 1000);
	    var milliseconds = Math.floor(this.timeSoFar % 1000);
	    if (milliseconds < 10) {
	        milliseconds = '00'  + milliseconds;
	    } else if (milliseconds < 100) {
	        milliseconds = '0' + milliseconds;
	    }
	    this.stopwatchText.setText(`${seconds}.${milliseconds}s`);
	}
}