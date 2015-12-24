import Analyser from 'audio-analyser';
import { spawn } from 'child_process';

const analyser = new Analyser({
  minFrequency: 20,
  maxFrequency: 20000,

  minDecibels: -90,
  maxDecibels: -0,

  fftSize: 512,
  frequencyBinCount: 512 / 2,
  smoothingTimeConstant: 0.2,

  // Maps to `-f cd` for `arecord`
  bufferSize: 22052,
  signed: true,
  float: false,
  bitDepth: 16,
  byteOrder: 'LE',
  channels: 2,
  interleaved: true,

  // initial channel
  channel: 0,
});

const child = spawn('arecord', [
  '-D', 'hw:Loopback,1,0',
  '-f', 'cd',
  '-t', 'raw',
]);
const stream = child.stdout.pipe(analyser);
const buffer = new Uint8Array(analyser.frequencyBinCount);

analyser.on('data', () => analyser.getByteFrequencyData(buffer));

export function getAudioData() {
  return buffer;
}

setInterval(() => {
  /* eslint no-console: 0 */
  console.log(getAudioData());
}, 5000);

process.on('exit', () => {
  stream.destroy();
});
