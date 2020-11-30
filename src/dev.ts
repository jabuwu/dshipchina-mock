import { app, frontend } from './app';
import * as env from './env';
import webpack from 'webpack';
import * as path from 'path';

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);

const middleware = webpackDevMiddleware(compiler);
frontend.use(middleware);
frontend.use(webpackHotMiddleware(compiler));
frontend.get('*', (_req, res) => {
  res.end(middleware.fileSystem.readFileSync(path.join(webpackConfig.output.path, 'index.html')));
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
