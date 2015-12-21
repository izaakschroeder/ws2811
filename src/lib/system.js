import { readFileSync } from 'fs';
import pruss from 'pruss';

import Allocator from './allocator';
import Pin from './pin/pixel';

export const pru = pruss.prus[0];
export const allocator = new Allocator(pru.data, pru.l3);
export const pins = JSON.parse(readFileSync('./share/pins.json', 'utf8'))
  .map(datum => new Pin(datum, allocator));

export function draw() {
  pru.reset();
  pru.enabled = true;
}

export function enable(state) {
  allocator.swap();
  if (!state) {
    allocator.buffer.fill(0);
  }
  draw();
}

pru.load('./firmware/firmware.bin');
