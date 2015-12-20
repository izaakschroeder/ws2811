
import pruss from 'pruss';
import { set as layout } from './lib/layout';

const pru = pruss.prus[0];

const res = layout({
  P9_24: 500,
});

console.log(res);

pru.run('./firmware/firmware.bin');
