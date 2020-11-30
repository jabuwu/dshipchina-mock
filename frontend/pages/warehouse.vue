<template>
  <div>
    <button type="button" class="btn btn-primary my-3" @click="productCreate()">Create Product</button>
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Photo</th>
            <th scope="col">SKU</th>
            <th scope="col">Inventory</th>
            <th scope="col">Weight/Volume</th>
            <th scope="col">Info</th>
            <th scope="col">Customs Declaration</th>
            <th scope="col">Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, ind) of products" :key="product.product_id">
            <th scope="row">{{ product.product_id }}</th>
            <td>N/A</td>
            <td><input-edit :value="product.sku" :disabled="product.busy" @change="productPut(ind, 'sku', $event)" /></td>
            <td><input-edit :value="product.inventory" type="number" :disabled="product.busy" @change="productPut(ind, 'inventory', $event)" /></td>
            <td>
              <b>Weight (g):</b><br /><input-edit :value="product.weight || 0" type="number" :disabled="product.busy"  @change="productPut(ind, 'weight', $event)" />
              <b>Width (cm):</b><br /><input-edit :value="product.width || 0" type="number" :disabled="product.busy"  @change="productPut(ind, 'width', $event)" />
              <b>Length (cm):</b><br /><input-edit :value="product.length || 0" type="number" :disabled="product.busy"  @change="productPut(ind, 'length', $event)" />
              <b>Height (cm):</b><br /><input-edit :value="product.height || 0" type="number" :disabled="product.busy"  @change="productPut(ind, 'height', $event)" />
            </td>
            <td>
              <b>Name</b><br />
              <input-edit :value="product.product_name" :disabled="product.busy" @change="productPut(ind, 'product_name', $event)" /><br />
              <b>Note</b><br />
              <input-edit :value="product.note" :disabled="product.busy" @change="productPut(ind, 'note', $event)" />
            </td>
            <td>
              <b>Name (English)</b><br />
              <input-edit :value="product.declare_name" :disabled="product.busy" @change="productPut(ind, 'declare_name', $event)" /><br />
              <b>Name (Chinese)</b><br />
              <input-edit :value="product.declare_name_cn" :disabled="product.busy" @change="productPut(ind, 'declare_name_cn', $event)" /><br />
              <b>Unit Value (USD)</b><br />
              <input-edit :value="product.declare_value" type="number" :disabled="product.busy" @change="productPut(ind, 'declare_value', $event)" />
            </td>
            <td>
              <div v-if="product.inventory > 0">
                Ship quantity:<br />
                <input v-model.number="product.ship_count" type="number" min="0" :max="product.inventory" @input="updateShipping()" @change="updateShipping()" :style="product.ship_count > product.inventory ? { color: 'red', border: '2px solid red', 'background-color': '#fee' } : (product.ship_count > 0 ? { color: 'green', border: '2px solid green', 'background-color': '#efe' } : {})" />
              </div>
              <button v-if="product.inventory === 0" type="button" class="btn btn-danger" @click="productDelete(ind)" :disabled="product.busy">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr />
    <div style="padding-bottom: 40px">
      <h2>
        Shipping
      </h2>
      <table style="width: 100%">
        <tbody>
          <tr>
            <td style="width: 25%; vertical-align: top">
              <div v-if="shipping.products.count == 0">Select items above</div>
              <div style="color: green" v-else>Count: {{ shipping.products.count }}</div>
            </td>
            <td style="width: 25%; vertical-align: top">
              <div v-if="shipping.products.count > 0">
                Address <button @click="randomShipping()">Random</button><br />
                <input placeholder="Recipient" v-model="shipping.address.recipient" @input="updateShipping()" /><br />
                <input placeholder="Company (optional)" v-model="shipping.address.company" @input="updateShipping()" /><br />
                <input placeholder="Street Address" v-model="shipping.address.street" @input="updateShipping()" /><br />
                <input placeholder="City" v-model="shipping.address.city" @input="updateShipping()" /><br />
                <input placeholder="State / Region" v-model="shipping.address.state" @input="updateShipping()" /><br />
                <select v-model="shipping.address.country" @input="changeCountry()">
                  <option v-for="(country, i) of countryList" v-if="i != 0" :value="i">{{ country }}</option>
                </select><br />
                <input placeholder="Postal Code" v-model="shipping.address.zipcode" @input="updateShipping()" /><br />
                <input placeholder="Phone Number" v-model="shipping.address.phone" @input="updateShipping()" /><br />
              </div>
            </td>
            <td style="width: 25%; vertical-align: top">
              <div v-if="shipping.address.ready && countryShipping">
                Ship Method<br />
                <select v-model="shipping.ship_id">
                  <option v-for="(method, i) of shippingMethods" v-if="i != 0 && countryShipping[shipping.address.country].indexOf(String(i)) != -1" :value="i">{{ method }}</option>
                </select><br />
              </div>
            </td>
            <td style="width: 25%; vertical-align: top">
              <div v-if="shipping.ship_id > 0">
                <button @click="checkout()">Ship</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { countryList, shippingMethods } from '../constants';
import InputEdit from '../components/input-edit.vue';
import { prepareProduct } from '../util';

export default {
  components: {
    InputEdit
  },
  data: () => ({
    loading: true,
    products: [],
    shipping: {
      products: {
        count: 0,
        items: []
      },
      address: {
        ready: false,
        recipient: '',
        company: '',
        street: '',
        city: '',
        state: '',
        country: 1,
        zipcode: '',
        phone: ''
      },
      ship_id: 0
    },
    countryList,
    shippingMethods,
    countryShipping: null
  }),
  async mounted() {
    this.getCountryShipping();
    let data = await fetch(`/admin/${this.$store.state.key}/products`);
    this.products = (await data.json()).products;
    for (let product of this.products) {
      prepareProduct(product);
    }
    this.products.reverse();
    this.loading = false;
  },
  methods: {
    async getCountryShipping() {
      let data = await fetch(`/admin/${this.$store.state.key}/country-shipping`);
      this.countryShipping = await data.json();
    },
    async productCreate() {
      let result = await fetch(`/admin/${this.$store.state.key}/products`, { method: 'POST' });
      if (result.status === 200) {
        let { product } = await result.json();
        prepareProduct(product);
        this.products.splice(0, 0, product);
        Vue.set(this.products, 0, this.products[0]);
      }
    },
    async productDelete(ind) {
      this.products[ind].busy = true;
      Vue.set(this.products, ind, this.products[ind]);
      let result = await fetch(`/admin/${this.$store.state.key}/products/${this.products[ind].product_id}`, { method: 'DELETE' });
      if (result.status === 200) {
        Vue.delete(this.products, ind);
      } else {
        this.products[ind].busy = false;
        Vue.set(this.products, ind, this.products[ind]);
      }
    },
    async productPut(ind, key, value) {
      this.products[ind].busy = true;
      Vue.set(this.products, ind, this.products[ind]);
      let result = await fetch(`/admin/${this.$store.state.key}/products/${this.products[ind].product_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [ key ]: value
        })
      });
      if (result.status === 200) {
        let { product } = await result.json();
        prepareProduct(product);
        Vue.set(this.products, ind, product);
      } else {
        this.products[ind].busy = false;
        Vue.set(this.products, ind, this.products[ind]);
      }
    },
    randomShipping() {
      this.shipping.address.recipient = faker.name.firstName() + ' ' + faker.name.lastName();
      this.shipping.address.company = Math.random() < 0.2 ? faker.company.companyName() : '';
      this.shipping.address.street = faker.address.streetAddress();
      this.shipping.address.city = faker.address.city();
      this.shipping.address.state = faker.address.state();
      this.shipping.address.country = Math.floor(Math.random() * (this.countryList.length - 1)) + 1;
      this.shipping.address.zipcode = faker.address.zipCode();
      this.shipping.address.phone = faker.phone.phoneNumber();
      this.changeCountry();
    },
    updateShipping() {
      this.shipping.products.count = 0;
      this.shipping.products.items = [];
      for (let product of this.products) {
        if (product.ship_count > 0 && product.ship_count <= product.inventory) {
          this.shipping.products.count += product.ship_count;
          this.shipping.products.items.push({
            product_id: product.product_id,
            qty: Number(product.ship_count)
          });
        }
      }
      this.shipping.address.ready = !!(this.shipping.address.recipient && this.shipping.address.street && this.shipping.address.city && this.shipping.address.state && this.shipping.address.country && this.shipping.address.zipcode && this.shipping.address.phone);
    },
    changeCountry() {
      this.shipping.ship_id = 0;
      this.updateShipping();
    },
    async checkout() {
      let data = await fetch(`/admin/${this.$store.state.key}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: this.shipping.address,
          products: this.shipping.products.items,
          ship_id: this.shipping.ship_id
        })
      });
      let result = await data.json();
      if (result.status === 200) {
        this.$router.push('/pending');
      }
    }
  }
};
</script>