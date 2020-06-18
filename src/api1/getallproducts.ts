import * as express from 'express';
import * as dship from '../dship';
import * as _ from 'lodash';

export default function(req: express.Request, res: express.Response) {
  if (!dship.validApi(req.query.key as string)) {
    return dship.response(res, { status: 501 });
  }
  let db = dship.db(req.query.key as string);
  let products = db.get('products').value();
  products = _.map(products, product => dship.productToJson(product));
  dship.response(res, {
    status: 200,
    products
  });
}