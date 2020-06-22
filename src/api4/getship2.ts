import * as express from 'express';
import * as dship from '../dship';
import * as _ from 'lodash';

export default function(req: express.Request, res: express.Response) {
  let query = dship.parseQuery(req, { maps: [ 'product_id', 'qty' ] });
  if (!query['product_id']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['qty']) {
    return dship.response(res, { status: 505 });
  }
  let db = dship.db(req.query.key as string);
  let product_ids: { [ key: string ]: string } = query['product_id'] as any;
  let qtys: { [ key: string ]: string } = query['qty'] as any;
  let weight = 0;
  let volume = 0;
  for (let key in product_ids) {
    let product_id = Number(product_ids[key] || 0);
    if (isNaN(product_id)) {
      return dship.response(res, { status: 510 });
    }
    let qty = Number(qtys[key] || 0);
    if (isNaN(qty) || qty < 0) {
      return dship.response(res, { status: 520 });
    }
    let product = db.get('products').find({ product_id }).value();
    if (!product) {
      return dship.response(res, { status: 510 });
    }
    if (product.inventory < qty) {
      return dship.response(res, { status: 520 });
    }
    if (product.weight) {
      weight += product.weight * qty;
    }
    if (product.width && product.height && product.length) {
      volume += product.width * product.height * product.length * qty;
    }
  }
  dship.response(res, {
    status: 200,
    weight,
    volume,
    ship: [
      {
        ship_fee: 13.37,
        ship_id: "1"
      }
    ]
  });
}