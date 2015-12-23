import { indexBy } from 'lodash';
import system from './lib/system';

const index = indexBy(system.pins, 'key');
const pin = index.P9_24;

pin.enabled = true;
pin.length = 400;

const colors = [
  0x00FF0000,
  0xFF000000,
];

let tick = 0;

setInterval(() => {
  ++tick;
  for (let i = 0; i < pin.state.length / 4; ++i) {
    pin.state.writeUInt32LE(tick % 2 === 0 ? colors[0] : colors[1], i * 4);
  }
  system.draw();
}, 1000);
