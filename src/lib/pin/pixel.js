import Pin from './base';

export default class PixelPin extends Pin {

  constructor(params, allocator) {
    super(params);
    this.allocator = allocator;
    this.saved = null;
  }

  get enabled() {
    return this.allocator.has(this);
  }

  set enabled(enable) {
    if (enable) {
      this.allocator.enable(this);
      if (this.saved) {
        this.length = this.saved.length;
        this.saved.state.copy(this.state);
      }
      this.direction = 'out';
    } else {
      this.saved = {
        state: new Buffer(this.state),
        length: this.length,
      };
      this.clear();
      this.allocator.disable(this);
    }
  }

  get state() {
    return this.allocator.buffer(this);
  }

  get length() {
    if (this.enabled) {
      return this.allocator.length(this);
    }
    return null;
  }

  set length(length) {
    this.allocator.resize(this, length);
  }

  clear() {
    this.state.fill(0);
  }
}
