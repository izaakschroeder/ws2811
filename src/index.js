
import { set as layout, draw } from './lib/layout';

const res = layout({
  P9_24: 500,
});

const pixels = res.pins.P9_24.data;

const colors = [
  0x00FF0000,
  0xFF000000,
];

let tick = 0;

setInterval(function() {
  ++tick;
  for (let i = 0; i < pixels.length / 4; ++i) {
    pixels.writeUInt32LE(tick % 2 === 0 ? colors[0] : colors[1], i * 4);
  }
  draw();
}, 1000);
