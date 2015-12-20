import Pin from './base';

export default class PixelPin extends Pin {

  constructor(params) {
    super(params);
    this.enabled = false;
  }

  get enabled() {

  }

  set enabled(enable) {
    if (enable) {
      this.direction = 'out';
    } else {
      this.state = null;
    }
  }

  get length() {
    if (!this.enabled) {
      return 0;
    }
  }

  set length(length) {

  }
}
