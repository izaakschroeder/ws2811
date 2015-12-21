
import express from 'express';

import pins from './route/pins';
import system from './route/system';
import error from './error';

const app = express();

app.use(error);
app.use('/pins', pins);
app.use('/system', system);

app.listen(process.env.PORT || 8080);
