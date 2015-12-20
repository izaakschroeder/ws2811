import pruss from 'pruss';
import { find, range } from 'lodash';

import pins from './pins';

const pru = pruss.prus[0];

export function get() {
  let offset = 0;
  let count = 0;
  const layout = [ ];
  while ((count = pru.data.readUint32LE(offset))) {
    const port = pru.data.readUint32LE(offset + 4);
    const mask = pru.data.readUint32LE(offset + 8);
    const pin = find(pins, pin => pin.port === port && pin.mask === mask);
    if (!pin) {
      throw new Error(`Invalid layout state; no matching pin: ${pin}.`);
    }
    const data = range(count).map(i => {
      return {
        address: pru.data.readUint32LE((offset + 12) + (i * 8)),
        length: pru.data.readUint32LE((offset + 12) + (i * 8) + 4),
      };
    });
    layout.push({
      pin,
      data,
    });
    offset += (3 + count * 2) * 4;
  }
  return layout;
}

export function set(layout) {
  let offset = 0;
  let address = pru.l3.address;
  Object.keys(layout).forEach(pinId => {
    const length = layout[pinId];
    const data = [ { address, length } ];
    const pin = find(pins, pin => pin.key === pinId);
    if (!pin) {
      throw new Error(`No such pin: ${pinId}.`);
    }
    pin.direction = 'out';
    pru.data.writeUInt32LE(data.length, offset);
    pru.data.writeUInt32LE(pin.port, offset + 4);
    pru.data.writeUInt32LE(pin.mask, offset + 8);
    data.forEach(({ address, length }, i) => {
      pru.data.writeUInt32LE(address, offset + 12 + (i * 8));
      pru.data.writeUInt32LE(length, (offset + 12) + (i * 8) + 4);
    });
    offset += (3 + data.length * 2) * 4;
    address += length * 4;
  });
  pru.data.writeUInt32LE(0, offset);
  return get();
}
