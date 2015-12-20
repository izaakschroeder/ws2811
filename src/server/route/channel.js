
import { Router } from 'express';
import channel from '../../lib/channel';

const routes = new Router();

routes.get('/', (req, res) => {
  res.send(channel.all());
});

routes.get('/:channel', (req, res) => {
  res.send(500);
});

routes.get('/:channel/state', (req, res) => {
  res.send(500);
});

routes.put('/:channel', (req, res) => {
  res.send(500);
});

routes.put('/:channel/state', (req, res) => {
  res.send(500);
});

export default routes;
