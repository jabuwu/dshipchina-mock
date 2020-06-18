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
    declare_value: query.declare_value == null ? undefined : Number(query.declare_value),
    declare_name: query.declare_name,
    description1: query.description1,
    description2: query.description2,
    sell: query.sell == null ? undefined : Number(query.sell),
    catalog_id: query.catalog_id == null ? undefined : Number(query.catalog_id)
  };
  // TODO: download_url, sort
  let product = dship.createProduct(db, data);
  dship.response(res, { status: '200', product: dship.productToJson(product) });
}