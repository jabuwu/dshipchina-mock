import * as dship from './dship';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

export const app = express();
app.set('json spaces', 2);

let admin = express.Router();
admin.use(bodyParser.json());
admin.use('/balance', require('./admin/balance').router);
admin.use('/products', require('./admin/products').router);
admin.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});
app.use('/admin/:api', (req, res, next) => {
  if (!dship.validApi(req.params['api'])) {
    return res.status(400).json({ error: 'Bad API key' });
  }
  (<any>req).api = req.params['api'];
  admin(req, res, next)
});

let api1 = express.Router();
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

let api2 = express.Router();
api2.get('/addimage.php', require('./api2/addimage').default);
api2.get('/addproductoption.php', require('./api2/addproductoption').default);
api2.get('/createaproduct.php', require('./api2/createaproduct').default);
api2.get('/deleteaproductoption.php', require('./api2/deleteaproductoption').default);
api2.get('/deleteimage.php', require('./api2/deleteimage').default);
api2.get('/editaproductoption.php', require('./api2/editaproductoption').default);
api2.get('/editimagesort.php', require('./api2/editimagesort').default);
api2.get('/editproduct.php', require('./api2/editproduct').default);
api2.get('/getallproducts.php', require('./api2/getallproducts').default);
api2.get('/getaproduct.php', require('./api2/getaproduct').default);
api2.get('/getproductflow.php', require('./api2/getproductflow').default);
api2.use((_req, res) => {
  res.status(404);
  res.send('File not found.');
});
app.use('/api2', api2);

let api3 = express.Router();
api3.get('/createorder.php', require('./api3/createorder').default);
api3.get('/getanorder.php', require('./api3/getanorder').default);
api3.get('/getaproduct.php', require('./api3/getaproduct').default);
api3.get('/getorders.php', require('./api3/getorders').default);
api3.get('/getsellerproducts.php', require('./api3/getsellerproducts').default);
api3.get('/markreceived.php', require('./api3/markreceived').default);
api3.use((_req, res) => {
  res.status(404);
  res.send('File not found.');
});
app.use('/api3', api3);

let api4 = express.Router();
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

app.use(express.static(path.join(__dirname, '../static')));
app.use((_req, res) => {
  res.send('Not found.');
});