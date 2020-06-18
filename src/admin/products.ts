import * as express from 'express';
import * as dship from '../dship';

export const router = express.Router();
router.get('/', (req, res) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let products = db.get('products').value();
  res.json({ products });
});
router.get('/:id', (req, res, next) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  let product = db.get('products').find({ product_id: Number(req.params.id) }).value();
  if (product) {
    res.json({ product });
  } else {
    next();
  }
});
router.delete('/:id', (req, res, next) => {
  let api: string = (<any>req).api;
  let db = dship.db(api);
  db.get('products').remove({ product_id: Number(req.params.id) }).value();
  res.json({});
});