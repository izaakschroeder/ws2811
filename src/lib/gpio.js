
import { writeFileSync } from 'fs';

const GPIO = [ 0x44E07000, 0x4804c000, 0x481AC000, 0x481AE000 ];

export const pins = [ {
  key: 'P9_11',
  gpio: 30,
}, {
  key: 'P9_12',
  gpio: 60,
}, {
  key: 'P9_13',
  gpio: 31,
}, {
  key: 'P9_14',
  gpio: 50,
}, {
  key: 'P9_15',
  gpio: 48,
}, {
  key: 'P9_16',
  gpio: 51,
}, {
  key: 'P9_17',
  gpio: 5,
}, {
  key: 'P9_18',
  gpio: 4,
}, {
  key: 'P9_19',
  gpio: 13,
}, {
  key: 'P9_20',
  gpio: 12,
}, {
  key: 'P9_21',
  gpio: 3,
}, {
  key: 'P9_22',
  gpio: 2,
}, {
  key: 'P9_23',
  gpio: 49,
}, {
  key: 'P9_24',
  gpio: 15,
} ];

pins.forEach(pin => {
  const index = Math.floor(pin.gpio / 32);
  pin.mask = (1 << (pin.gpio % (index * 32)));
  pin.port = GPIO[index];
  pins[pin.key] = pin;
});

function unuse(name) {

}

export function use(name) {
  const { gpio } = pins[name];
  writeFileSync(`/sys/class/gpio/gpio${gpio}/direction`, 'utf8', 'out');
}
