import { app, frontend } from './app';
import * as env from './env';
import express from 'express';
import * as path from 'path';

frontend.use(express.static(path.join(__dirname, 'frontend')));

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});