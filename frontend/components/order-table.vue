<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Waybill ID</th>
          <th scope="col">Submitted Time</th>
          <th scope="col">Address</th>
          <th scope="col">Products</th>
          <th scope="col">Shipping Method</th>
          <th scope="col">Weight/Volume</th>
          <th scope="col">Fees</th>
          <th scope="col">Note</th>
          <th scope="col">Operation</th>
          <th scope="col" v-if="shipped">Tracking</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, ind) of orders" v-if="order.waybill_status == status" :key="order.waybill_id">
          <th scope="row">{{ order.waybill_id }}</th>
          <td>{{ new Date(Number(order.time2) * 1000).toLocaleDateString() }}</td>
          <td>
            <b>{{ order.recipient }}</b><br />
            <span style="color: #3c763d">{{ order.street }}</span><br />
            <span style="color: #a94442">{{ order.city }}</span> <span style="color: #8a6d3b">{{ order.state }}</span><br />
            <span style="color: #337ab7">{{ countryList[order.country_id] }}</span><br />
            <span>{{ order.zipcode }}</span><br />
            <span style="color: #31708f">{{ order.phone }}</span>
          </td>
          <td>
            <table>
              <thead>
                <tr>
                  <th>PID</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product of order.products" :key="product.product_id">
                  <td>{{ product.product_id }}</td>
                  <td>{{ product.qty }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>{{ shippingMethods[order.ship_id] }}</td>
          <td>{{ order.weight }} g<br />{{ order.volume }} cm<sup>3</sup></td>
          <td>{{ (order.price + order.ship_fee).toFixed(2) }}</td>
          <td>{{ order.note }}</td>
          <td>
            <div v-if="!shipped">
              <input placeholder="Tracking number..." v-model="order.trackingNumber" /><br />
              <button class="btn btn-outline-primary" type="button" @click="$emit('ship', { ind, tracking: order.trackingNumber })">Ship</button>
            </div>
            <div v-if="!shipped">
              <button class="btn btn-outline-danger" type="button" @click="$emit('cancel', { ind })">Cancel</button>
            </div>
            <div v-if="status == 41">
              <button class="btn btn-outline-primary" type="button" @click="$emit('receive', { ind })">Receive</button>
            </div>
            <div v-if="status == 5">
              <button class="btn btn-outline-primary" type="button" @click="$emit('ret', { ind })">Return</button>
            </div>
            <div v-if="status == 60">
              <button class="btn btn-outline-primary" type="button" @click="$emit('reset', { ind })">Reset</button>
            </div>
          </td>
          <td v-if="shipped">{{ order.track_number }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { countryList, shippingMethods } from '../constants';

export default {
  template: `
  `,
  props: {
    orders: {
      default: []
    },
    status: {
      type: Number,
      default: 30
    },
    shipped: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    countryList,
    shippingMethods,
    trackingNumber: ''
  })
};
</script>