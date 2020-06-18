import * as express from 'express';
import * as dship from '../dship';

export const router = express.Router();
router.get('/', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let balance = db.get('balance').value();
  res.json({ balance });
});
router.put('/', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  db.set('balance', req.body.balance).write();
  res.json({ balance: req.body.balance });
});