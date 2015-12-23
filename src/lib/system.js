import { readFileSync } from 'fs';
import pruss from 'pruss';

import Allocator from './allocator';
import Pin from './pin/pixel';

export const pru = pruss.prus[0];
export const allocator = new Allocator(pru.data, pru.l3);
export const pins = JSON.parse(readFileSync('./share/pins.json', 'utf8'))
  .map(datum => new Pin(datum, allocator));

class System {

  constructor({ allocator, pru, pins }) {
    this.allocator = allocator;
    this.state = new Buffer(this.allocator.data.length);
    this.state.fill(0);
    this.pru = pru;
    this.pins = pins;
    this.pru.load('./firmware/firmware.bin');
    this.enabled = true;
  }

  set enabled(on) {
    if (on) {
      this.state.copy(this.allocator.data);
      this._enabled = true;
    } else {
      this.state = new Buffer(this.allocator.data);
      this.allocator.data.fill(0);
      this._enabled = false;
    }
    this.draw();
  }

  get enabled() {
    return this._enabled;
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
