import * as express from 'express';
import * as dship from '../dship';
import { countryCodes } from '../constants';

export default function(req: express.Request, res: express.Response) {
  if (!dship.validApi(req.query.key as string)) {
    return dship.response(res, { status: 501 });
  }
  if (req.query.weight == null) {
    return dship.response(res, { status: 505 });
  }
  let weight = Number(req.query.weight);
  if (isNaN(weight) || weight <= 0) {
    return dship.response(res, { status: 500 });
  }
  if (!req.query.country_code) {
    return dship.response(res, { status: 505 });
  }
  let countryInd = countryCodes.indexOf(req.query.country_code as string);
  if (countryInd === -1) {
    return dship.response(res, { status: 500 });
  }
  dship.response(res, {
    status: 200,
    ship: [
      {
        ship_fee: 13.37,
        ship_id: "1"
      }
    ]
  });
}