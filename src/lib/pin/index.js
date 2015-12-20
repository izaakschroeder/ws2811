import pruss from 'pruss';
import { readFileSync } from 'fs';
import Pin from './pixel';

const pru = pruss.prus[0];
const metadata = pru.data;
const buffer = pru.l3;

const data = JSON.parse(readFileSync('./share/pins.json', 'utf8'));
const pins = data.map(datum => new Pin(datum));

export function sync() {
  const active = pins.filter(pin => pin.enabled && pin.length > 0);
  let address = 0;
  metadata.writeUInt32LE(active.length, 0);
  metadata.writeUInt32LE(buffer.address, 4);
  active.forEach((pin, i) => {
    const offset = 8 + i * 16;
    const state = buffer.slice(address, address + pin.length * 4);
    metadata.writeUInt32LE(pin.length, offset + 0);
    metadata.writeUInt32LE(pin.port, offset + 4);
    metadata.writeUInt32LE(pin.mask, offset + 8);
    metadata.writeUInt32LE(address, offset + 12);
    pin.state = state;
    address += state.length;
  });
}

export default pins;

pru.load('./firmware/firmware.bin');
