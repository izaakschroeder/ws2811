
import { Router } from 'express';
import { json } from 'body-parser';

import { get, set } from '../../lib/layout';

const routes = new Router();

routes.use(json());

routes.get('/', (req, res) => {
  res.status(200).send(get());
});

routes.post('/', (req, res) => {
  res.status(200).send(set(req.body));
});

/**
 * Fetch the matching pin for any pin in a request. e.g. Fetch data for P9_22
 * in the request `/P9_22/state`. If the pin is not found, raise an error.
 */
routes.param('pin', (req, res, next, id) => {
  const layout = get();
  if (id in layout) {
    req.pin = layout[id];
    next();
  } else {
    next({ status: 404 });
  }
});

/**
 *
 */
routes.patch('/:pin/state', (req, res) => {
  res.send(500);
});

/**
 * The simplest update operation. Overwrite all pixel values for a pin. For
 * more complex/nuanced operations use the `PATCH` method.
 */
routes.put('/:pin/state', (req, res, next) => {
  const pin = req.pin;
  if (req.body.length !== pin.data.length) {
    next({ status: 400, error: 'INVALID_LENGTH', expected: pin.data.length });
  } else {
    for (let i = 0; i < req.body.length; ++i) {
      pin.data.writeUInt32LE(req.body[i], i * 4);
    }
    res.send(200);
  }
});

/**
 * Fetch the current pixel data being fed to a pin.
 */
routes.get('/:pin/state', (req, res) => {
  res.send(req.pin.data);
});

export default routes;
