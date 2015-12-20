
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

export default routes;
