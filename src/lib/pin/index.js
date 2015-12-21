import pruss from 'pruss';
import { readFileSync } from 'fs';
import Pin from './pixel';
import Allocator from './allocator';

const pru = pruss.prus[0];
const allocator = new Allocator(pru.data, pru.l3, draw);
const data = JSON.parse(readFileSync('./share/pins.json', 'utf8'));
const pins = data.map(datum => new Pin(datum, allocator));

export function draw() {
  pru.reset();
  pru.enabled = true;
}

export default pins;

pru.load('./firmware/firmware.bin');
