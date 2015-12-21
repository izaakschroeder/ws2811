
import express from 'express';

import pins from './route/pins';
import error from './error';

const app = express();

app.use(error);
app.use('/pins', pins);

app.listen(process.env.PORT || 8080);
