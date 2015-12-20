
import { Router } from 'express';
import pins from '../../lib/gpio';

const routes = new Router();

routes.get('/', (req, res) => {
  res.send(pins);
});

export default routes;
