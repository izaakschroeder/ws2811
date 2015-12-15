
import express from 'express';

import layout from './route/layout';
import channel from './route/channel';

const app = express();

app.use('/layout', layout);
app.use('/channel', channel);

app.listen(process.env.PORT || 8080);
