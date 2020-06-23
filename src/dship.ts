import * as express from 'express';
import * as _ from 'lodash';
import * as URL from 'url';
import * as fs from 'fs';
import { shippingMethods, countryCodes } from './constants';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

export function validApi(api?: string) {
  return !!api;
}

let dbs: { [ api: string ]: any } = {};
export function db(api: string): any {
  let db = dbs[api];
  if (!db) {
    let adapter = new FileSync(`db/${api}.json`);
    db = low(adapter);
    dbs[api] = db;
  }
  db.defaults({
    balance: 100,
    tracking_hook: '',
    next_product_id: 1,
    next_waybill_id: 1,
    next_bill_id: 1,
    products: [],
    orders: [],
    bill_record: []
  }).write();
  return db;
}

export class Product {
  product_id:      number;
  sku:             string        = '';
  product_name:    string | null = null;
  note:            string | null = null;
  declare_value:   number        = 0;
  declare_name:    string | null = null;
  declare_name_cn: string | null = null;
  weight:          number | null = null;
  length:          number | null = null;
  width:           number | null = null;
  height:          number | null = null;
  price:           number        = 0;
  product_type:    number        = 1;
  inventory:       number        = 0;
  image:           any[];
}

export function createProduct(db: any, data: Partial<Exclude<Product, 'product_id'>>) {
  let product = new Product();
  _.assign(product, _.pickBy(data, o => o !== undefined));
  product.product_id = db.get('next_product_id').value();
  if (!product.sku) {
    product.sku = String(product.product_id);
  }
  db.get('products').push(product).write();
  db.set('next_product_id', product.product_id + 1).write();
  return product;
}

export function editProduct(db: any, id: number, data: Partial<Exclude<Product, 'product_id'>>) {
  if (!db.get('products').find({ product_id: id }).value()) {
    return null;
  }
  data = _.pickBy(data, o => o !== undefined);
  db.get('products').find({ product_id: id }).assign(data).write();
  return db.get('products').find({ product_id: id }).value();
}

export function productToJson(product: Product) {
  return {
    product_id: String(product.product_id),
    sku: product.sku == null ? '0' : product.sku,
    product_name: product.product_name == null ? '0' : product.product_name,
    note: product.note == null ? '0' : product.note,
    declare_value: product.declare_value.toFixed(2),
    declare_name: product.declare_name == null ? '0' : product.declare_name,
    weight: product.weight == null ? '0' : String(product.weight),
    length: product.length == null ? '0' : String(product.length),
    width: product.width == null ? '0' : String(product.width),
    height: product.height == null ? '0' : String(product.height),
    product_type: String(product.product_type)
  };
}

class Order {
  waybill_id:     number;
  weight:         number;
  volume:         number;
  time2:          number;
  service_fee:    number        = 0;
  price:          number        = 0;
  ship_fee:       number        = 0;
  ship_id:        number;
  country_id:     number;
  city:           string        = '';
  state:          string        = '';
  street:         string        = '';
  zipcode:        string        = '';
  phone:          string        = '';
  recipient:      string        = '';
  company:        string        = '';
  note:           string | null = null;
  waybill_type:   number        = 1;
  waybill_status: number        = 30;
  track_number:   string        = '';
  products: {
    product_id:   number,
    qty:          number
  }[];
}

class CreateOrderOptions {
  subtractFromBalance?: boolean;
}
export function createOrder(db: any, data: Partial<Exclude<Order, 'waybill_id'>>, options: CreateOrderOptions = {}) {
  options.subtractFromBalance = options.subtractFromBalance ?? false;
  let order = new Order();
  _.assign(order, _.pickBy(data, o => o !== undefined));
  order.waybill_id = db.get('next_waybill_id').value();
  order.service_fee = 0; // TODO: calculate
  if (options.subtractFromBalance) {
    chargeBalance(db, 21, -(order.price + order.service_fee + order.ship_fee));
  }
  db.get('orders').push(order).write();
  db.set('next_waybill_id', order.waybill_id + 1).write();
  // TOOD: decrement product inventories?
  return order;
}
export function shipOrder(db: any, id: number, track_number: string) {
  if (!db.get('orders').find({ waybill_id: id }).value()) {
    return null;
  }
  db.get('orders').find({ waybill_id: id }).assign({ track_number, waybill_status: 41 }).write();
  return db.get('orders').find({ waybill_id: id }).value();
}
export function receiveOrder(db: any, id: number) {
  if (!db.get('orders').find({ waybill_id: id }).value()) {
    return null;
  }
  db.get('orders').find({ waybill_id: id }).assign({ waybill_status: 5 }).write();
  return db.get('orders').find({ waybill_id: id }).value();
}
export function returnOrder(db: any, id: number) {
  if (!db.get('orders').find({ waybill_id: id }).value()) {
    return null;
  }
  db.get('orders').find({ waybill_id: id }).assign({ waybill_status: 60 }).write();
  return db.get('orders').find({ waybill_id: id }).value();
}
export function resetOrder(db: any, id: number) {
  if (!db.get('orders').find({ waybill_id: id }).value()) {
    return null;
  }
  db.get('orders').find({ waybill_id: id }).assign({ track_number: '', waybill_status: 30 }).write();
  return db.get('orders').find({ waybill_id: id }).value();
}

export function orderToJson(order: Order, context: 'create' | 'get' | 'getAll') {
  return _.pickBy({
    waybill_id: String(order.waybill_id),
    weight: String(order.weight),
    volume: String(order.volume),
    time2: String(order.time2),
    service_fee: (context === 'create' || context === 'getAll') ? String(order.service_fee) : undefined,
    price: context === 'get' ? String(order.price) : undefined,
    ship_fee: (context === 'get' || context === 'getAll') ? String(order.ship_fee) : undefined,
    ship_id: String(order.ship_id),
    country_id: String(order.country_id),
    city: order.city,
    state: order.state,
    street: order.street,
    zipcode: order.zipcode,
    phone: order.phone,
    recipient: order.recipient,
    company: order.company,
    note: order.note == null ? '0' : order.note, // TODO: can be null
    waybill_type: String(order.waybill_type),
    waybill_status: String(order.waybill_status),
    track_number: (context === 'get' || context === 'getAll') ? order.track_number : undefined,
    products: _.map(order.products, product => ({
      product_id: String(product.product_id),
      qty: String(product.qty)
    }))
  }, o => o !== undefined);
}

export class ParseQueryOptions {
  // specifies queries that must be maps
  maps?: string[];
}
export function parseQuery(req: express.Request, options: ParseQueryOptions = {}): { [ key: string ]: string | { [ key: string ]: string } } {
  options.maps = options.maps ?? [];
  let rawQuery = URL.parse(req.url).query;
  if (!rawQuery) {
    return {};
  }
  let params = rawQuery.split('&');
  let result: { [ key: string ]: string | { [ key: string ]: string } } = {};
  for (let param of params) {
    let split = param.split('=');
    if (split.length == 2) {
      let key = split[0];
      let value = split[1];
      let index: string | null = null;
      let indMatch = key.match(/\[.*\]$/);
      if (indMatch) {
        index = indMatch[0].substr(1, indMatch[0].length - 2);
        key = key.substr(0, key.length - indMatch[0].length);
      }
      if (index !== null) {
        if (options.maps.indexOf(key) !== -1) {
          if (typeof result[key] === 'string' || !result[key]) {
            result[key] = {};
          }
          result[key][index] = value;
        }
      } else {
        result[key] = value;
      }
    }
  }
  for (let map of options.maps) {
    if (_.isString(result[map])) {
      result[map] = {};
    }
  }
  return result;
}

export function parseProductQuery(product_ids: { [ key: string ]: string }, qtys: { [ key: string ]: string }): { product_id: number, qty: number }[] {
  let products: { product_id: number, qty: number }[] = [];
  for (let key in product_ids) {
    let product_id = Number(product_ids[key] || 0);
    if (isNaN(product_id)) {
      throw { status: 510 };
    }
    let qty = Number(qtys[key] || 0);
    if (isNaN(qty) || qty < 0) {
      throw { status: 520 };
    }
    if (qty !== 0) {
      products.push({ product_id, qty });
    }
  }
  return products;
}

const realShipRates = _.attempt(fs.readFileSync, './getshiprate.json');
export function fakeShipRates() {
  let results: any[] = [];
  for (let i = 1; i < countryCodes.length; ++i) {
    results.push({
      coid: String(i),  //countryid
      shid: '1',	//shipping method ID
      fwei: '500',	// first weight define /g
      awei: '500',  // added weight define/g
      ffee: '115.76', // first weight cost / USD
      afee: '41.63',  // added weight cost / USD
      weibo: '21000', // weight bound for big weight price, If there a data here, mean when weight > this data, we should calculate the shipping cost base on bofwei,boawei,boffee,boafee
      bofwei: '1000', //When weight >weight bound, first weight define /g
      boawei: '1000', //When weight >weight bound, added weight define /g
      boffee: '37.17',//When weight >weight bound, first weight cost/ USD
      boafee: '37.17',//When weight >weight bound, added weight cost/ USD
      fufee: '18.00', // Fuel surcharge
      refee: '0.00', // register fee
      sen2: '15.00', // % , copy brand extra fee, >1000 mean not accept copy brand for this rule
      sen3: '25.00', // % , famous copy brand extra fee, >1000 mean not accept famous copy brand for this rule
      sen4: '10.00', // % , with battery/magnetic extra fee, >1000 mean not accept battery/magnetic for this rule
      sen5: '2000.00', // % , pure battery extra fee, >1000 mean not accept battery for this rule
      sen6: '2000.00', // % , liquid or powder extra fee, >1000 mean not accept liquid or powder for this rule
      minwei: '0',		// Minimum weight for the rule  /g
      maxwei: '0',	// Maximum weight for the rule /g
      typ: '1',     //the way how to calculate volume weight.
      date1: '3',   //Minimum Shipping time /day   only for reference
      date2: '7',   //Maximum Shipping time /day   only for reference
      note: '0',	//special note for this rule
      time: '1532070878'  //Lastest update time for this rule
    });
  }
  return results;
}
let shipRatesCache = null;
export function shipRates() {
  if (shipRatesCache) {
    return shipRatesCache;
  }
  if (realShipRates instanceof Error) {
    shipRatesCache = fakeShipRates();
  } else {
    shipRatesCache = JSON.parse(realShipRates.toString());
  }
  return shipRatesCache;
}

export class ShippingOption {
  ship_id: number;
  ship_fee: number;
}
export function calculateShippingDship(country_id: number, ship_id: number, weight: number, volume?: number | null): number | null {
  let fetch = shipRates();
  let row = _.find(fetch, { coid: String(country_id), shid: String(ship_id) });
  if (!row) {
    return null;
  }
  row = _.mapValues(row, o => Number(o));
  let wei: number;
  volume = volume === null ? 0 : volume;
  switch (row.typ) {
  case 1:
    wei = (weight > volume / 5) ? weight : volume / 5;
    break;  
  case 2:
    wei = weight;
    break;
  case 3:
    wei = (weight > volume / 2) ? weight : volume / 2;
    break;
  case 4:
    wei = (weight > volume / 6) ? weight : volume / 6;
    break;
  default:
    wei = (weight > volume / 5) ? weight : volume / 5;
  }
  let shippingcost: number;
  if (wei <= row.weibo || row.weibo == 0) {
    let addedcount = Math.ceil((wei - row.fwei) > 0 ? (wei - row.fwei) / row.awei : 0);
    let sensp = 1; // TODO: calculate special shipping costs
    shippingcost = (row.ffee + row.afee * addedcount + row.refee) * (row.fufee / 100 + 1) * sensp;
  } else {
    let addedcount = Math.ceil((wei - row.bofwei) > 0 ? (wei-row.bofwei) / row.boawei : 0);
    let sensp = 1; // TODO: calculate special shipping costs
    shippingcost = (row.boffee + row.boafee * addedcount + row.refee) * (row.fufee / 100 + 1) * sensp;
  }
  return Math.round(shippingcost * 100) / 100;
}
export function calculateShipping(country_id: number, weight: number, volume?: number | null): ShippingOption[] {
  let results: ShippingOption[] = [];
  for (let i = 1; i < shippingMethods.length; ++i) {
    let fee = calculateShippingDship(country_id, i, weight, volume);
    if (fee !== null) {
      results.push({
        ship_id: i,
        ship_fee: fee
      });
    }
  }
  return results;
}
export function calculateShippingProductQuery(db: any, country_id: number, product_ids: { [ key: string ]: string }, qtys: { [ key: string ]: string }) {
  let weight = 0;
  let volume = 0;
  for (let key in product_ids) {
    let product_id = Number(product_ids[key] || 0);
    if (isNaN(product_id)) {
      throw { status: 510 };
    }
    let qty = Number(qtys[key] || 0);
    if (isNaN(qty) || qty < 0) {
      throw { status: 520 };
    }
    let product = db.get('products').find({ product_id }).value();
    if (!product) {
      throw { status: 510 };
    }
    if (product.inventory < qty) {
      throw { status: 520 };
    }
    if (product.weight) {
      weight += product.weight * qty;
    }
    if (product.width && product.height && product.length) {
      volume += product.width * product.height * product.length * qty;
    }
  }
  return { weight, volume, shipping: calculateShipping(country_id, weight, volume) };
};

export class Bill {
  bill_id:   number;
  bill_type: number;
  note:      string | null = null;
  amount:    number;
  balance:   number;
  time:      number;
}
export function createBill(db: any, data: Partial<Exclude<Bill, 'bill_id'>>) {
  let bill = new Bill();
  _.assign(bill, _.pickBy(data, o => o !== undefined));
  bill.bill_id = db.get('next_bill_id').value();
  bill.time = unixTime();
  db.get('bill_record').push(bill).write();
  db.set('next_bill_id', bill.bill_id + 1).write();
  return bill;
}
export function chargeBalance(db: any, bill_type: number, amount: number) {
  let balance = db.get('balance').value();
  if (balance - amount < 0) {
    throw { status: 510 };
  }
  balance = Math.floor((balance + amount) * 100) / 100;
  db.set('balance', balance).write();
  createBill(db, {
    bill_type,
    amount,
    balance
  });
}
export function billToJson(bill: Bill) {
  return {
    bill_id: String(bill.bill_id),
    bill_type: String(bill.bill_type),
    note: bill.note == null ? '0' : bill.note,
    amount: String(bill.amount),
    balance: String(bill.balance),
    time: String(bill.time)
  };
}

export class ResponseOptions {
  json?: boolean;
}
export function response(res: express.Response, json: any, options: ResponseOptions = {}) {
  options.json = options.json ?? false;
  if (options.json) {
    res.setHeader('Content-Type', 'application/json');
  }
  res.send(JSON.stringify(json).replace(/\//g, '\\/'));
}

export function nyi(res: express.Response) {
  response(res, { status: 500, error: 'Not yet implemented' });
}

export function unixTime() {
  return Math.floor(new Date().getTime() / 1000);
}