const channels = { };

// pixels = [{ pin, offset, length }, ...]
export class Channel {
  constructor({ id, pixels }) {
    this.id = id;
    this.pixels = pixels;
  }
}

export function all() {
  return channels;
}

export function get(id) {
  return channels[id];
}

export function put(id, pixels) {
  channels[id] = new Channel({ id, pixels });
}

export function del(id) {
  delete channels[id];
}
