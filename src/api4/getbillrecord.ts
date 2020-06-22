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
    dship.response(res, { status: 500 });
  }
  let db = dship.db(req.query.key as string);
  let bill_record = db.get('bill_record').filter(o => o.time >= time1 && o.time <= time2).value();
  bill_record = _.map(bill_record, bill => dship.billToJson(bill));
  dship.response(res, {
    status: 200,
    bill_record
  });
}