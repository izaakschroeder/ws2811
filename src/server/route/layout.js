
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

routes.param('pin', (req, res, next, id) => {
  const layout = get();
  req.pin = layout[id];
  next();
});

routes.patch('/:pin', (req, res) => {

});

routes.put('/:pin', (req, res) => {
  const pin = req.pin;
  for (let i = 0; i < req.body.length; ++i) {
    pin.data.writeUInt32LE(req.body[i], i * 4);
  }
  res.send(200);
});

routes.get('/:pin', (req, res) => {
  res.send(req.pin.data);
});

export default routes;
