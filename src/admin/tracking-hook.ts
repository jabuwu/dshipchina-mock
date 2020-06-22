import * as express from 'express';
import * as dship from '../dship';

export const router = express.Router();
router.get('/', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let url = db.get('tracking_hook').value();
  res.json({ url });
});
router.put('/', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  db.set('tracking_hook', req.body.url).write();
  res.json({ url: req.body.url });
});