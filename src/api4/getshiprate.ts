import * as express from 'express';
import * as dship from '../dship';

export default function(_req: express.Request, res: express.Response) {
  dship.response(res, dship.shipRates(), { json: true });
}