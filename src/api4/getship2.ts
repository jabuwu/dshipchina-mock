import * as express from 'express';
import * as _ from 'lodash';
import * as dship from '../dship';
import { countryCodes } from '../constants';

export default function(req: express.Request, res: express.Response) {
  let query = dship.parseQuery(req, { maps: [ 'product_id', 'qty' ] });
  if (!query['product_id']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['qty']) {
    return dship.response(res, { status: 505 });
  }
  if (!req.query.country_code) {
    return dship.response(res, { status: 505 });
  }
  let countryInd = countryCodes.indexOf(req.query.country_code as string);
  if (countryInd === -1) {
    return dship.response(res, { status: 533 });
  }
  let db = dship.db(req.query.key as string);
  let product_ids: { [ key: string ]: string } = query['product_id'] as any;
  let qtys: { [ key: string ]: string } = query['qty'] as any;
  try {
    let { weight, volume, shipping } = dship.calculateShippingProductQuery(db, product_ids, qtys);
    let ship = _.map(shipping, ship => ({
      ship_fee: ship.ship_fee,
      ship_id: String(ship.ship_id)
    }));
    dship.response(res, {
      status: 200,
      weight,
      volume,
      ship
    });
  } catch (err) {
    dship.response(res, err);
  }
}