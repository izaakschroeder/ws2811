
import pruss from 'pruss';
import layout from './lib/layout';

const pru = pruss.prus[0];

const res = layout.set({
  P9_24: 500,
});

console.log(res);

pru.run('./firmware/firmware.bin');
