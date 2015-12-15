
var bone = require('bonescript'),
	pruss = require('pruss');

/**
 * Create a driver for LED pixels being driven by WS2811 chips.
 * @param {Object} options
 *
 */
function WS2811(options) {
	this.pru = pruss.prus[0];
	this.pixels = pru.l3.slice(0, options.pixels*4);
	this.pins = { };
	this.index = { };
}

/**
 * Map some logical pixels to physical pins and positions.
 *
 *
 */
WS2811.prototype.map = function mapPixel(i, pin, pos) {

}

/**
* Map some logical pixels to physical pins.
*
*
*/
WS2811.prototype.set = function setPixel(index, r, g, b, a) {
	index = index*4;
	this.pixels[index+0] = clamp(a || 0);
	this.pixels[index+1] = clamp(r);
	this.pixels[index+2] = clamp(g);
	this.pixels[index+3] = clamp(b);
}

/**
* Map some logical pixels to physical pins.
*
*
*/
WS2811.prototype.get = function getPixel(index) {
	return this.pixels.slice(index*4, 4);
}

/**
 * Clear all the pixels.
 *
 *
 */
WS2811.prototype.clear = function clear() {
	for (var i = 0; i < pixels.length; ++i) {
		this.pixels[i] = 0;
	}
}

/**
* Start driving the pixels.
*
*
*/
WS2811.prototype.start = function start() {
	// Clear any old data
	this.clear();

	// Set any data lines to be outputs
	bone.pinMode('P9_22', bone.OUTPUT);
	bone.pinMode('P9_24', bone.OUTPUT);

	// Setup the PRU
	this.pru.ocp = true;
	this.pru.data.writeUInt32LE(pru.l3.address, 0);

	// Start processing
	this.pru.run(firmware);
}

/**
 * Stop driving the pixels.
 *
 *
 */
WS2811.prototype.stop = function stop() {
	// Clear data to turn everything off
	this.clear();
	// Stop processing
	this.pru.stop();

}

function clamp(p) {
	return Math.max(Math.min(Math.round(p),255),0);
}

module.exports = WS2811;
