
import express from 'express';

import pins from './route/pins';

const app = express();

app.use('/pins', pins);

app.listen(process.env.PORT || 8080);
