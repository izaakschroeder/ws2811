
import express from 'express';

import layout from './route/layout';
import channel from './route/channel';
import pins from './route/pins';

const app = express();

app.use('/layout', layout);
app.use('/channel', channel);
app.use('/pins', pins);

app.listen(process.env.PORT || 8080);
