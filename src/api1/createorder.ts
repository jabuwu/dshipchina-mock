import * as express from 'express';
import * as _ from 'lodash';
import * as dship from '../dship';
import { countryCodes, shippingMethods } from '../constants';

export default function(req: express.Request, res: express.Response) {
  if (!dship.validApi(req.query.key as string)) {
    return dship.response(res, { status: 501 });
  }
  let query = dship.parseQuery(req, { maps: [ 'product_id', 'qty' ] });
  if (!query['recipient']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['street']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['city']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['state']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['country_code']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['zipcode']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['phone']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['ship_id']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['product_id']) {
    return dship.response(res, { status: 505 });
  }
  if (!query['qty']) {
    return dship.response(res, { status: 505 });
  }
  let country_id = countryCodes.indexOf(req.query.country_code as string);
  if (country_id === -1) {
    return dship.response(res, { status: 533 });
  }
  let db = dship.db(req.query.key as string);
  let ship_id = Number(query['ship_id'] as string);
  if (isNaN(ship_id)) {
    return dship.response(res, { status: 500 }); // TODO: check actual return code
  }
  if (ship_id === 0) {
    return dship.response(res, { status: 500 }); // TODO: check actual return code
  }
  if (!shippingMethods[ship_id]) {
    return dship.response(res, { status: 500 }); // TODO: check actual return code
  }
  let product_ids: { [ key: string ]: string } = query['product_id'] as any;
  let qtys: { [ key: string ]: string } = query['qty'] as any;
  try {
    let { weight, volume, shipping } = dship.calculateShippingProductQuery(db, country_id, product_ids, qtys);
    let shippingMethod = _.find(shipping, { ship_id });
    if (!shippingMethod) {
      return dship.response(res, { status: 530 }); // TODO: check actual return code
    }
    let time2 = new Date().getTime(); // TODO: not sure how this is calculated
    let ship_fee = shippingMethod.ship_fee;
    let products = dship.parseProductQuery(product_ids, qtys); // TODO: error on no products?
    let order = dship.createOrder(db, {
      weight,
      volume,
      time2,
      ship_fee,
      ship_id,
      country_id,
      city: query['city'] as string,
      state: query['state'] as string,
      street: query['street'] as string,
      zipcode: query['zipcode'] as string,
      phone: query['phone'] as string,
      recipient: query['recipient'] as string,
      company: (query['company'] as string) || '', // TODO: can this be null?
      note: (query['note'] as string) || null,
      products
    }, {
      subtractFromBalance: true
    });
    dship.response(res, { status: 200, order: dship.orderToJson(order, 'create') });
  } catch (err) {
    dship.response(res, err);
  }
}