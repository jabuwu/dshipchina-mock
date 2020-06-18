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
  let query: { [ key: string ]: string } = req.query as any;
  let data = {
    sku: query.sku,
    product_name: query.product_name,
    note: query.note,
    declare_value: query.declared_value == null ? undefined : Number(query.declared_value),
    declare_name: query.declared_name
  };
  let product = dship.editProduct(db, product_id, data);
  if (!product) {
    return dship.response(res, { status: 500 });
  }
  dship.response(res, { status: '200' });
}