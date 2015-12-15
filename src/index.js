
import { pins } from './lib/gpio';
import pruss from 'pruss';

const pru = pruss.prus[0];

const pixels = pru.l3;

const layout = [
  // ## List 1
  1, // 1 address in for this list
  pins.P9_22.port,
  pins.P9_22.mask,
  pixels.address,
  400, // 400 of them
  // ## List 2
  1,
  pins.P9_24.port,
  pins.P9_24.mask,
  pixels.address,
  50,
  0,
];

// Write the layout to the PRU dataspace
for (let i = 0; i < layout.length; ++i) {
  pru.data.writeUInt32LE(layout[i], i * 4);
}

for (let i = 0; i < 400; ++i) {
  pixels.writeUInt32LE(0, i * 4);
}

pru.run('./firmware/firmware.bin');
