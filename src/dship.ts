import * as express from 'express';
import * as _ from 'lodash';
import * as URL from 'url';

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
    next_product_id: 1,
    next_waybill_id: 1,
    products: [],
    orders: []
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
  waybill_id: number;
  weight: number;
  volume: number;
  time2: number;
  service_fee: number;
  price: number;
  ship_fee: number;
  ship_id: number;
  country_id: number;
  city: string;
  state: string;
  street: string;
  zipcode: string;
  phone: string;
  recipient: string;
  company: string;
  note: string;
  waybill_type: number;
  waybill_status: number;
  track_number: string;
  products: {
    product_id: number,
    qty: number
  }[];
}

export function createOrder(db: any, data: Partial<Exclude<Order, 'waybill_id'>>) {
  let order = new Order();
  _.assign(order, _.pickBy(data, o => o !== undefined));
  order.waybill_id = db.get('next_waybill_id').value();
  order.service_fee = 0; // TODO: calculate
  order.waybill_type = 1; // TODO: is this ever not 1?
  order.waybill_status = 30; // TODO: what are the waybill statuses? is this always 30 to begin with?
  db.get('orders').push(order).write();
  db.set('next_waybill_id', order.waybill_id + 1).write();
  // TOOD: decrement product inventories?
  return order;
}

export function orderToJson(order: Order) {
  return {
    waybill_id: String(order.waybill_id),
    weight: String(order.weight),
    volume: String(order.volume),
    time2: String(order.time2),
    service_fee: String(order.service_fee),
    ship_id: String(order.ship_id),
    country_id: String(order.country_id),
    city: order.city,
    state: order.state,
    street: order.street,
    zipcode: order.zipcode,
    phone: order.phone,
    recipient: order.recipient,
    company: order.company,
    note: order.note,
    waybill_type: String(order.waybill_type),
    waybill_status: String(order.waybill_status),
    products: _.map(order.products, product => ({
      product_id: String(product.product_id),
      qty: String(product.qty)
    }))
  };
}

export class ParseQueryOptions {
  // specifies queries that must be maps
  maps?: string[];
}
export function parseQuery(req: express.Request, options: ParseQueryOptions = new ParseQueryOptions()): { [ key: string ]: string | { [ key: string ]: string } } {
  options.maps = options.maps || [];
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

export class ShippingOption {
  ship_id: number;
  ship_fee: number;
}
export function calculateShipping(weight: number, volume?: number | null) {
  return [
    {
      ship_fee: 13.37,
      ship_id: 1
    },
    {
      ship_fee: weight + volume,
      ship_id: 2
    }
  ];
}
export function calculateShippingProductQuery(db: any, product_ids: { [ key: string ]: string }, qtys: { [ key: string ]: string }) {
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
  return { weight, volume, shipping: calculateShipping(weight, volume) };
};

export function response(res: express.Response, json: any) {
  res.send(JSON.stringify(json).replace(/\//g, '\\/'));
}

export function nyi(res: express.Response) {
  response(res, { status: 500, error: 'Not yet implemented' });
}