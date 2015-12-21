
import { Router } from 'express';
import { json } from 'body-parser';
import { indexBy, pick, mapValues } from 'lodash';
import pins from '../../lib/pin';

const routes = new Router();
const index = indexBy(pins, 'key');

function pin(pin) {
  return pick(pin, 'enabled', 'key', 'length');
}

routes.use(json());

routes.get('/', (req, res) => {
  res.status(200).send(mapValues(index, pin));
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

routes.post('/:pin/enable', (req, res) => {
  req.pin.enabled = true;
  res.status(200).send(pin(req.pin));
});

routes.post('/:pin/disable', (req, res) => {
  req.pin.enabled = false;
  res.status(200).send(pin(req.pin));
});

routes.put('/:pin/length', (req, res, next) => {
  if (typeof req.body !== 'number') {
    next({ status: 400, error: 'INVALID_TYPE' });
  } else if (req.body < 0 || req.body > 3000) {
    next({ status: 400, error: 'OUT_OF_BOUNDS', min: 0, max: 3000 });
  } else if (req.body % 1 !== 0) {
    next({ status: 400, error: 'INVALID_TYPE' });
  } else {
    req.pin.length = req.body;
    res.status(200).send(pin(req.pin));
  }
});

/**
 * Fetch the current pixel data being fed to a pin.
 */
routes.get('/:pin/state', (req, res) => {
  res.send(req.pin.state);
});

/**
 * The simplest update operation. Overwrite all pixel values for a pin. For
 * more complex/nuanced operations use the `PATCH` method.
 */
routes.put('/:pin/state', (req, res, next) => {
  const pin = req.pin;
  if (req.body.length !== pin.length / 4) {
    next({ status: 400, error: 'INVALID_LENGTH', expected: pin.length });
  } else {
    for (let i = 0; i < req.body.length; ++i) {
      pin.state.writeUInt32LE(req.body[i], i * 4);
    }
    res.send(200);
  }
});

/**
 *
 */
routes.patch('/:pin/state', (req, res) => {
  res.send(500);
});

export default routes;
