import { writeFileSync, readFileSync } from 'fs';

const GPIO = [ 0x44E07000, 0x4804c000, 0x481AC000, 0x481AE000 ];

export default class Pin {

  constructor({ key, gpio }) {
    this.key = key;
    this.gpio = gpio;
  }

  get port() {
    return GPIO[Math.floor(this.gpio / 32)];
  }

  get mask() {
    return (1 << (this.gpio % 32));
  }

  get direction() {
    return readFileSync(`/sys/class/gpio/gpio${this.gpio}/direction`, 'utf8');
  }

  set direction(direction) {
    if (direction !== 'in' && direction !== 'out') {
      throw new TypeError('Invalid direction.');
    }
    writeFileSync(
      `/sys/class/gpio/gpio${this.gpio}/direction`,
      direction,
      {
        encoding: 'utf8',
      }
    );
  }

  get value() {
    return parseInt(
      readFileSync(`/sys/class/gpio/gpio${this.gpio}/value`, 'utf8'),
      10
    );
  }

  set value(value) {
    writeFileSync(`/sys/class/gpio/gpio${this.gpio}/value`, value, {
      encoding: 'utf8',
    });
  }
}
