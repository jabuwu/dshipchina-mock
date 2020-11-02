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
  let time1 = Number(req.query.time1);
  let time2 = Number(req.query.time2);
  if (isNaN(time1) || isNaN(time2)) {
    return dship.response(res, { status: 500 });
  }
  let db = dship.db(req.query.key as string);
  let orders = db.get('orders').filter((o: any) => o.time2 >= time1 && o.time2 <= time2).value();
  if (orders.length === 0) {
    return dship.response(res, { status: 500 });
  }
  orders = _.map(orders, order => dship.orderToJson(order, 'getAll'));
  dship.response(res, {
    status: 200,
    orders
  });
}