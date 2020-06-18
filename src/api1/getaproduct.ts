import * as express from 'express';
import * as dship from '../dship';

export default function(req: express.Request, res: express.Response) {
  if (!dship.validApi(req.query.key as string)) {
    return dship.response(res, { status: 501 });
  }
  if (req.query.product_id == null) {
    return dship.response(res, { status: 505 });
  }
  let product_id = Number(req.query.product_id);
  if (isNaN(product_id)) {
    return dship.response(res, { status: 500 });
  }
  let db = dship.db(req.query.key as string);
  let product = db.get('products').find({ product_id }).value();
  if (!product) {
    return dship.response(res, { status: 500 });
  }
  dship.response(res, {
    status: 200,
    product
  });
}