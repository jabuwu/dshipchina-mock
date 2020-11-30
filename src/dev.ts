import { app, frontend } from './app';
import * as env from './env';
import webpack from 'webpack';

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);

frontend.use(webpackDevMiddleware(compiler));
frontend.use(webpackHotMiddleware(compiler));

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
