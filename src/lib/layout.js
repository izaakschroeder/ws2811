import pruss from 'pruss';
import { find } from 'lodash';

import pins from './pins';

const pru = pruss.prus[0];

pru.load('./firmware/firmware.bin');

export function draw() {
  pru.enabled = true;
}

export function get() {
  let offset = 8;
  const count = pru.data.readUInt32LE(0);
  const base = pru.data.readUInt32LE(4);
  const layout = { };
  for (let i = 0; i < count; ++i) {
    const length = pru.data.readUInt32LE(offset + 0);
    const port = pru.data.readUInt32LE(offset + 4);
    const mask = pru.data.readUInt32LE(offset + 8);
    const start = pru.data.readUInt32LE(offset + 12);
    const pin = find(pins, pin => pin.port === port && pin.mask === mask);
    if (!pin) {
      throw new Error(`Invalid layout state; no matching pin: ${pin}.`);
    }
    layout[pin.key] = {
      pin,
      data: pru.l3.slice(start, start + length * 4),
    };
    offset += 16;
  }
  return {
    pins: layout,
    length: count,
    base,
  };
}

export function set(layout) {
  let offset = 8;
  let address = 0;
  const keys = Object.keys(layout);
  pru.data.writeUInt32LE(keys.length, 0);
  pru.data.writeUInt32LE(pru.l3.address, 4);
  keys.forEach(pinId => {
    const length = layout[pinId];
    const pin = find(pins, pin => pin.key === pinId);
    if (!pin) {
      throw new Error(`No such pin: ${pinId}.`);
    }
    pin.direction = 'out';
    pru.data.writeUInt32LE(length, offset + 0);
    pru.data.writeUInt32LE(pin.port, offset + 4);
    pru.data.writeUInt32LE(pin.mask, offset + 8);
    pru.data.writeUInt32LE(address, offset + 12);
    offset += 16;
    address += length * 4;
  });

  return get();
}
