
import pruss from 'pruss';
import { set as layout } from './lib/layout';

const pru = pruss.prus[0];

const res = layout({
  P9_24: 500,
});

const pixels = res[0].buffers[0];

for (let i = 0; i < pixels.length; ++i) {
  pixels.writeUInt32LE(0xFFFF0000, i * 4);
}

console.log(res);

pru.run('./firmware/firmware.bin');
