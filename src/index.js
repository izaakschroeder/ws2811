import { indexBy } from 'lodash';
import pins, { draw } from './lib/pin';

const index = indexBy(pins, 'key');
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
  draw();
}, 1000);
