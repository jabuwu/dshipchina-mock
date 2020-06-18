import * as express from 'express';
import * as dship from '../dship';

export default function(req: express.Request, res: express.Response) {
  if (!dship.validApi(req.query.key as string)) {
    return dship.response(res, { status: 501 });
  }
  let db = dship.db(req.query.key as string);
  let balance = db.get('balance').value();
  dship.response(res, {
    status: '200',
    balance: balance.toFixed(2)
  });
}