import * as express from 'express';
import * as dship from '../dship';

export const router = express.Router();
router.get('/', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let orders = db.get('orders').value();
  res.json({ orders });
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
  console.log('we did it');
  db.get('orders').remove({ waybill_id: Number(req.params.id) }).write();
  res.json({});
});