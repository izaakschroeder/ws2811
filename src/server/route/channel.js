
import { Router } from 'express';
import channel from '../../lib/channel';

const routes = new Router();

routes.get('/', (req, res) => {
  res.send(channel.all());
});

routes.get('/:channel', (req, res) => {

});

routes.get('/:channel/state', (req, res) => {

});

routes.put('/:channel', (req, res) => {

});

routes.put('/:channel/state', (req, res) => {

});

export default routes;
