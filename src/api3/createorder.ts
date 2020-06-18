import * as express from 'express';
import * as dship from '../dship';

export default function(_req: express.Request, res: express.Response) {
  dship.nyi(res);
}