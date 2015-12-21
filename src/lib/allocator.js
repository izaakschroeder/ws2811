
export default class Allocator {
  constructor(metadata, buffer) {
    this.pins = { };
    this.metadata = metadata;
    this.index = -1;
    this.buffers = [
      buffer.slice(0, buffer.length >>> 1),
      buffer.slice(buffer.length >>> 1),
    ];
    this.swap();
  }

  all() {
    return Object.keys(this.pins).sort().map(key => this.pins[key]);
  }

  swap() {
    ++this.index;
    if (this.index >= this.buffers.length) {
      this.index = 0;
    }
    this.data = this.buffers[this.index];
    this.metadata.writeUInt32LE(this.data.address, 4);
  }

  require(pin) {
    if (this.has(pin)) {
      return this.pins[pin.key];
    }
    throw new TypeError(`Missing pin: ${pin.key}.`);
  }

  has(pin) {
    return pin.key in this.pins;
  }

  enable(pin) {
    if (!(pin.key in this.pins)) {
      this.pins[pin.key] = {
        key: pin.key,
        port: pin.port,
        mask: pin.mask,
        length: 0,
        address: 0,
      };
    }
  }

  disable(pin) {
    if (pin.key in this.pins) {
      this.resize(pin, 0);
      delete this.pins[pin.key];
    }
  }

  // TODO: Copy back the buffer data when resizing. e.g. if an address has
  // changed, for all buffers shift data by the difference in the address
  resize(pin, length) {
    const entry = this.require(pin);
    if (entry.length !== length) {
      let address = 0;
      entry.length = length;
      this.all().forEach(entry => {
        entry.address = address;
        address += entry.length * 4;
      });
      this.sync();
    }
  }

  buffer(pin) {
    const entry = this.require(pin);
    return this.data.slice(entry.address, entry.address + entry.length * 4);
  }

  length(pin) {
    return this.require(pin).length;
  }

  sync() {
    const pins = this.all().filter(pin => pin.length > 0);
    this.metadata.writeUInt32LE(pins.length, 0);
    this.metadata.writeUInt32LE(this.data.address, 4);
    pins.forEach((pin, i) => {
      const offset = 8 + i * 16;
      this.metadata.writeUInt32LE(pin.length, offset + 0);
      this.metadata.writeUInt32LE(pin.port, offset + 4);
      this.metadata.writeUInt32LE(pin.mask, offset + 8);
      this.metadata.writeUInt32LE(pin.address, offset + 12);
    });
  }
}
