import Pin from './base';

export default class PixelPin extends Pin {

  constructor(params, allocator) {
    super(params);
    this.allocator = allocator;
  }

  get enabled() {
    return this.allocator.has(this);
  }

  set enabled(enable) {
    if (enable) {
      this.allocator.enable(this);
      this.direction = 'out';
    } else {
      this.allocator.disable(this);
    }
  }

  get state() {
    return this.allocator.buffer(this);
  }

  get length() {
    return this.allocator.length(this);
  }

  set length(length) {
    this.allocator.resize(this, length);
  }
}
