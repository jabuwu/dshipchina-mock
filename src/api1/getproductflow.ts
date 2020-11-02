import * as express from 'express';
import * as _ from 'lodash';
import * as dship from '../dship';

export default function(req: express.Request, res: express.Response) {
  if (!dship.validApi(req.query.key as string)) {
    return dship.response(res, { status: 501 });
  }
  if (!req.query.time1) {
    return dship.response(res, { status: 505 });
  }
  if (!req.query.time2) {
    return dship.response(res, { status: 505 });
  }
  if (req.query.product_id) {
    // NOTE: this reproduces a bug in dshipchina API
    return dship.response(res, { status: 500 });
  }
  let time1 = Number(req.query.time1);
  let time2 = Number(req.query.time2);
  if (isNaN(time1) || isNaN(time2)) {
    dship.response(res, { status: 500 });
  }
  try {
    let db = dship.db(req.query.key as string);
    let product_flow = db.get('product_flow').filter((o: any) => o.time >= time1 && o.time <= time2).value();
    if (product_flow.length === 0) {
      return dship.response(res, { status: 500 });
    }
    product_flow = _.map(product_flow, flow => dship.productFlowToJson(flow));
    dship.response(res, { status: '200', product_flow });
  } catch (err) {
    dship.response(res, err);
  }
}