
import { Router } from 'express';
import pins from '../../lib/pins';

const routes = new Router();

routes.get('/', (req, res) => {
  res.send(pins);
});

export default routes;
