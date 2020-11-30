import * as express from 'express';
import * as dship from '../dship';
import * as _ from 'lodash';

export default function(req: express.Request, res: express.Response) {
  if (!dship.validApi(req.query.key as string)) {
    return dship.response(res, { status: 501 });
  }
  let db = dship.db(req.query.key as string);
  let query: { [ key: string ]: string } = req.query as any;
  let data = {
    sku: query.sku,
    product_name: query.product_name,
    note: query.note,
    declare_name: query.declared_name,
    declare_name_cn: query.declared_name_cn,
    declare_value: Number(query.declared_value)
  };
  let product = dship.createProduct(db, data);
  dship.response(res, { status: '200', product_id: String(product.product_id) });
}