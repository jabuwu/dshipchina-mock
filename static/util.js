import Vue from 'vue';

export function prepareProduct(product) {
  product.declare_name = product.declare_name == null ? '0' : product.declare_name;
  product.declare_name_cn = product.declare_name_cn == null ? '0' : product.declare_name_cn;
  product.declare_value = product.declare_value.toFixed(2)
  Vue.set(product, 'busy', false);
  Vue.set(product, 'ship_count', '0');
}

export function prepareOrder(order) {
  order.trackingNumber = '';
}

export function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
}