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
  let country_id = countryCodes.indexOf(req.query.country_code as string);
  if (country_id === -1) {
    return dship.response(res, { status: 533 });
  }
  let volume: number | null = null;
  if (req.query.volume) {
    volume = Number(req.query.volume);
    if (isNaN(volume)) {
      volume = null;
    }
  }
  let ship = _.map(dship.calculateShipping(country_id, weight, volume), ship => ({
    ship_fee: ship.ship_fee,
    ship_id: ship.ship_id,
    min_day: ship.min_day,
    max_day: ship.max_day,
    ship_note: ship.ship_note
  }));
  dship.response(res, {
    status: 200,
    ship
  });
}