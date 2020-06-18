import * as express from 'express';
import * as _ from 'lodash';

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
    products: []
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
  description1:    string | null = null;
  description2:    string | null = null;
  sell:            number        = 1;
  catalog_id:      number        = 0;
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
  db.get('products').push(product).write();
  db.set('next_product_id', product.product_id + 1).write();
  return product;
}

export function editProduct(db: any, id: number, data: Partial<Exclude<Product, 'product_id'>>) {
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

export function response(res: express.Response, json: any) {
  res.send(JSON.stringify(json).replace(/\//g, '\\/'));
}

export function nyi(res: express.Response) {
  response(res, { status: 500, error: 'Not yet implemented' });
}