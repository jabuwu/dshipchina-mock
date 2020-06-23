import * as express from 'express';
import * as dship from '../dship';
import { shippingMethods } from '../constants';

export default function(req: express.Request, res: express.Response) {
  if (!dship.validApi(req.query.key as string)) {
    return dship.response(res, { status: 501 });
  }
  if (!req.query.waybill_id) {
    return dship.response(res, { status: 505 });
  }
  let waybill_id = Number(req.query.waybill_id);
  if (isNaN(waybill_id)) {
    return dship.response(res, { status: 508 });
  }
  let db = dship.db(req.query.key as string);
  let order = db.get('orders').find({ waybill_id }).value();
  if (!order) {
    return dship.response(res, { status: 508 });
  }
  if (order.waybill_status === 30) {
    return dship.response(res, { status: 536 });
  }
  dship.response(res, {
    status: 200,
    waybill_id: String(order.waybill_id),
    track_number: order.track_number,
    ship_id: String(order.ship_id),
    track_info: {
      ReferenceNumber: null,
      ItemReceived: '2020-02-02 02:02:02',
      ItemDispatched: null,
      DepartfromAirport: null,
      ArrivalfromAbroad: null,
      CustomsClearance: null,
      DestinationArrived: null,
      weblink: 'https://www.google.com/',
      phone: null,
      carrier_code: shippingMethods[order.ship_id],
      trackinfo: order.waybill_status === 41 ? [
        {
          Date: '2020-02-02 02:02:02',
          StatusDescription: 'Customs status updated',
          Details: 'LOS ANGELES GATEWAY, CA - USA',
          checkpoint_status: 'transit',
          ItemNode: 'ItemReceived'
        }
      ] : [
        {
          Date: '2020-02-02 12:02:02',
          StatusDescription: 'Delivered',
          Details: 'SOMEWHERE',
          checkpoint_status: 'delivered'
        },
        {
          Date: '2020-02-02 02:02:02',
          StatusDescription: 'Customs status updated',
          Details: 'LOS ANGELES GATEWAY, CA - USA',
          checkpoint_status: 'transit',
          ItemNode: 'ItemReceived'
        }
      ]
    }
  });
}