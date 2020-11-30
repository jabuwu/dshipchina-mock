import { app, frontend } from './app';
import * as env from './env';
import express from 'express';
import * as path from 'path';

frontend.use(express.static(path.join(__dirname, 'frontend')));
frontend.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});