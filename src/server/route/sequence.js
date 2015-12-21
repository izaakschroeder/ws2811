import { Router } from 'express';
import { json } from 'body-parser';

// POST a sequence blob, get back a UUID
// use that UUID to seek in the sequence / play / pause / etc.

const routes = new Router();
routes.use(json());

routes.post('/', (req, res) => {
  res.send(500);
});

routes.post('/:sequence/seek', (req, res) => {
  res.send(500);
});

routes.post('/:sequence/play', (req, res) => {
  res.send(500);
});

routes.post('/:sequence/pause', (req, res) => {
  res.send(500);
});

export default routes;
