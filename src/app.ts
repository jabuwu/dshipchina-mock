import * as dship from './dship';
import express from 'express';
import * as bodyParser from 'body-parser';

export const app = express();
app.set('json spaces', 2);
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const admin: express.Router = express.Router();
admin.use(bodyParser.json());
admin.get('/country-shipping', (_req, res) => {
  res.json(dship.countryShipping());
});
admin.post('/getshiprate', async (req, res) => {
  let realKey = req.body.realKey as string;
  if (realKey) {
    res.json({ success: await dship.fetchRealShipRates(realKey) });
  } else {
    res.status(400).json({ error: 'Missing key' });
  }
});
admin.post('/importproducts', async (req, res) => {
  let realKey = req.body.realKey as string;
  let key = req.body.key as string;
  if (realKey && key) {
    res.json({ success: await dship.importProducts(realKey, key) });
  } else {
    res.status(400).json({ error: 'Missing keys' });
  }
});
admin.use('/:api/*', (req, res, next) => {
  if (!dship.validApi(req.params['api'])) {
    res.status(400).json({ error: 'Bad API key' });
    return;
  }
  (<any>req).api = req.params['api'];
  next();
});
admin.use('/:api/balance', require('./admin/balance').router);
admin.use('/:api/orders', require('./admin/orders').router);
admin.use('/:api/products', require('./admin/products').router);
admin.use('/:api/tracking-hook', require('./admin/tracking-hook').router);
admin.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});
app.use('/admin', admin);

const api1: express.Router = express.Router();
api1.get('/createorder.php', require('./api1/createorder').default);
api1.get('/createproduct.php', require('./api1/createproduct').default);
api1.get('/editproduct.php', require('./api1/editproduct').default);
api1.get('/getallproducts.php', require('./api1/getallproducts').default);
api1.get('/getanorder.php', require('./api1/getanorder').default);
api1.get('/getaproduct.php', require('./api1/getaproduct').default);
api1.get('/getorders.php', require('./api1/getorders').default);
api1.get('/getproductflow.php', require('./api1/getproductflow').default);
api1.get('/getshiptrack.php', require('./api1/getshiptrack').default);
api1.get('/markreceived.php', require('./api1/markreceived').default);
api1.use((_req, res) => {
  res.status(404);
  res.send('File not found.');
});
app.use('/api1', api1);

const api4: express.Router = express.Router();
api4.get('/getbalance.php', require('./api4/getbalance').default);
api4.get('/getbillrecord.php', require('./api4/getbillrecord').default);
api4.get('/getship1.php', require('./api4/getship1').default);
api4.get('/getship2.php', require('./api4/getship2').default);
api4.get('/getshiprate.php', require('./api4/getshiprate').default);
api4.use((_req, res) => {
  res.status(404);
  res.send('File not found.');
});
app.use('/api4', api4);

export const frontend: express.Router = express.Router();
app.use(frontend);

//app.use(express.static(path.join(__dirname, '../static')));
app.use((_req, res) => {
  res.send('Not found.');
});