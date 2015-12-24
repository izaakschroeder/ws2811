import { readFileSync } from 'fs';
import pruss from 'pruss';
import raf from 'raf';

import Allocator from './allocator';
import Pin from './pin/pixel';

export const pru = pruss.prus[0];
export const allocator = new Allocator(pru.data, pru.l3);
export const pins = JSON.parse(readFileSync('./share/pins.json', 'utf8'))
  .map(datum => new Pin(datum, allocator));

class System {

  constructor({ allocator, pru, pins }) {
    this.stats = {
      rendered: 0,
      fps: 0,
    };
    this.allocator = allocator;
    this.state = new Buffer(this.allocator.data.length);
    this.state.fill(0);
    // set everything to red on init for fun
    for (let i = 0; i < this.state.length; i += 4) {
      this.state.writeUInt32LE(0xFF000000, i);
    }
    this.pru = pru;
    this.pins = pins;
    this.pru.load('./firmware/firmware.bin');
    this.enabled = true;
  }

  set enabled(on) {
    if (this._enabled !== !!on) {
      if (on) {
        this.state.copy(this.allocator.data);
        this._enabled = true;
      } else {
        this.state = new Buffer(this.allocator.data);
        this.allocator.data.fill(0);
        this._enabled = false;
      }
      this.draw(); // flush changes
      this.frame(); // render animations and stuff
    }
  }

  get enabled() {
    return this._enabled;
  }

  frame() {
    if (this._enabled) {
      const now = Date.now();
      // Update FPS counter.
      this.stats.fps = 1000 / (now - this.stats.rendered);

      this.draw();
      this.stats.rendered = now;

      raf(() => this.frame());
    }
  }

  draw() {
    this.pru.reset();
    this.pru.enabled = true;
  }
}

const system = new System({
  pins,
  allocator,
  pru,
});

process.on('exit', () => {
  system.enabled = false;
});

export default system;
