import * as express from 'express';
import * as _ from 'lodash';
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
    return dship.response(res, { status: 533 });
  }
  let volume: number | null = null;
  if (req.query.volume) {
    volume = Number(req.query.volume);
    if (isNaN(volume)) {
      volume = null;
    }
  }
  let ship = _.map(dship.calculateShipping(weight, volume), ship => ({
    ship_fee: ship.ship_fee,
    ship_id: String(ship.ship_id)
  }));
  dship.response(res, {
    status: 200,
    ship
  });
}