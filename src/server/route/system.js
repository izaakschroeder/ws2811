
import { Router } from 'express';
import { json } from 'body-parser';
import system from '../../lib/system';

const routes = new Router();
routes.use(json());

routes.get('/', (req, res) => {
  res.status(200).send({
    enabled: system.enabled,
    fps: system.stats.fps,
  });
});

routes.patch('/', (req, res) => {
  const patch = req.body;
  if ('enabled' in patch) {
    system.enabled = patch.enabled;
  }
  res.status(200).send({});
});

export default routes;
