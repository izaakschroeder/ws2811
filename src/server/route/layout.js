
import { Router } from 'express';
import { json } from 'body-parser';

import layout from '../../lib/layout';

const routes = new Router();

routes.use(json());

routes.get('/', (req, res) => {
  res.status(200).send(layout.get());
});

routes.post('/', (req, res) => {
  res.status(200).send(layout.set(req.body));
});

export default routes;
