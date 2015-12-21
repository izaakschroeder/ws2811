
import { Router } from 'express';
import { json } from 'body-parser';
import { indexBy, pick, mapValues } from 'lodash';
import pins from '../../lib/pin';

const routes = new Router();
const index = indexBy(pins, 'key');

function state(pin) {
  const buf = [ ];
  for (let i = 0; i < pin.length; ++i) {
    const color = pin.state.readUInt32LE(i * 4);
    buf.push(color);
  }
  return buf;
}

function dump(pin) {
  return {
    ...pick(pin, 'enabled', 'key', 'length'),
    state: state(pin),
  };
}

routes.use(json());

routes.get('/', (req, res) => {
  res.status(200).send(mapValues(index, dump));
});

/**
 * Fetch the matching pin for any pin in a request. e.g. Fetch data for P9_22
 * in the request `/P9_22/state`. If the pin is not found, raise an error.
 */
routes.param('pin', (req, res, next, id) => {
  if (id in index) {
    req.pin = index[id];
    next();
  } else {
    next({ status: 404, error: 'NOT_FOUND' });
  }
});

const validators = {
  length(value) {
    if (typeof value !== 'number') {
      throw Object.assign(new TypeError(), {
        status: 400,
        error: 'INVALID_TYPE',
      });
    } else if (value < 0 || value > 3000) {
      throw Object.assign(new TypeError(), {
        status: 400,
        error: 'OUT_OF_BOUNDS',
        min: 0,
        max: 3000,
      });
    } else if (value % 1 !== 0) {
      throw Object.assign(new TypeError(), {
        status: 400,
        error: 'INVALID_TYPE',
      });
    }
  },
  enabled(value) {
    if (typeof value !== 'boolean') {
      throw Object.assign(new TypeError(), {
        status: 400,
        error: 'INVALID_TYPE',
      });
    }
  },
  state(value) {
    if (!Array.isArray(value)) {
      throw Object.assign(new TypeError(), {
        status: 400,
        error: 'INVALID_TYPE',
      });
    }
  },
};

routes.patch('/:pin', (req, res) => {
  const patch = req.body;
  const pin = req.pin;

  // Validation
  Object.keys(patch, key => {
    if (key in validators) {
      validators(patch[key]);
    }
  });

  // Set
  if ('enabled' in patch) {
    req.pin.enabled = patch.enabled;
  }
  if ('length' in patch) {
    req.pin.length = patch.length;
  }
  if ('state' in patch) {
    for (let i = 0; i < patch.state.length; ++i) {
      pin.state.writeUInt32LE(patch.state[i], i * 4);
    }
  }

  res.status(200).send(dump(pin));
});

routes.get('/:pin', (req, res) => {
  res.status(200).send(dump(req.pin));
});

export default routes;
