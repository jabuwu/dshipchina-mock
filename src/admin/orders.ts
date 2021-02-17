import * as express from 'express';
import * as dship from '../dship';
import * as _ from 'lodash';

export const router = express.Router();
router.get('/', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let orders = db.get('orders').value();
  res.json({ orders });
});
router.post('/', (req, res) => {
  let country_id = Number(req.body.address.country);
  let ship_id = Number(req.body.ship_id);
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let time2 = dship.unixTime(); // TODO: not sure how this is calculated
  let { weight, volume, shipping } = dship.calculateShippingProducts(db, country_id, req.body.products);
  let shippingMethod = _.find(shipping, { ship_id: String(ship_id) }) as dship.ShippingOption;
  if (!shippingMethod) {
    return dship.response(res, { status: 530 }); // TODO: check actual return code
  }
  let ship_fee = shippingMethod.ship_fee;
  let order = dship.createOrder(db, {
    weight,
    volume,
    time2,
    ship_fee,
    ship_id,
    country_id,
    city: req.body.address.city,
    state: req.body.address.state,
    street: req.body.address.street,
    zipcode: req.body.address.postal,
    phone: req.body.address.phone,
    recipient: req.body.address.recipient,
    company: req.body.address.company,
    note: '',
    products: req.body.products
  });
  res.json({ status: 200, order });
});
router.put('/:id/ship', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let order = dship.shipOrder(db, Number(req.params.id), req.body.tracking);
  res.json({ order });
});
router.put('/:id/receive', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let order = dship.receiveOrder(db, Number(req.params.id));
  res.json({ order });
});
router.put('/:id/return', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let order = dship.returnOrder(db, Number(req.params.id));
  res.json({ order });
});
router.put('/:id/reset', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let order = dship.resetOrder(db, Number(req.params.id));
  res.json({ order });
});
router.delete('/:id', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  dship.cancelOrder(db, Number(req.params.id));
  res.json({});
});
