
import { Router } from 'express';
import { json } from 'body-parser';
import { enable } from '../../lib/system';

const routes = new Router();
routes.use(json());

routes.patch('/', (req, res) => {
  const patch = req.body;
  if ('enabled' in patch) {
    enable(patch.enabled);
  }
  res.status(200).send({});
});

export default routes;
