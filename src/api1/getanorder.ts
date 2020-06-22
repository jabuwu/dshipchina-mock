import * as express from 'express';
import * as dship from '../dship';

export default function(req: express.Request, res: express.Response) {
  if (!dship.validApi(req.query.key as string)) {
    return dship.response(res, { status: 501 });
  }
  if (req.query.waybill_id == null) {
    return dship.response(res, { status: 505 });
  }
  let waybill_id = Number(req.query.waybill_id);
  if (isNaN(waybill_id)) {
    return dship.response(res, { status: 500 });
  }
  let db = dship.db(req.query.key as string);
  let order = db.get('orders').find({ waybill_id }).value();
  if (!order) {
    return dship.response(res, { status: 500 });
  }
  dship.response(res, {
    status: 200,
    order: dship.orderToJson(order, 'get')
  });
}