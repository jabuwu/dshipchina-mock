function prepareProduct(product) {
  product.declare_name = product.declare_name == null ? '0' : product.declare_name;
  product.declare_name_cn = product.declare_name_cn == null ? '0' : product.declare_name_cn;
  product.declare_value = product.declare_value.toFixed(2)
  product.busy = false;
}

const Warehouse = Vue.component('warehouse', {
  template: `
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
              <td>{{ product.weight || 0 }}g<br />{{ product.width || 0 }} x {{ product.length || 0 }} x {{ product.height || 0 }} cm</td>
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
              <td><button v-if="product.inventory === 0" type="button" class="btn btn-danger" @click="productDelete(ind)" :disabled="product.busy">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  data: () => ({
    loading: true,
    products: []
  }),
  async mounted() {
    let data = await fetch('/admin/abc/products');
    this.products = (await data.json()).products;
    for (let product of this.products) {
      prepareProduct(product);
    }
    this.products.reverse();
    this.loading = false;
  },
  methods: {
    async productCreate() {
      let result = await fetch(`/admin/abc/products`, { method: 'POST' });
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
      let result = await fetch(`/admin/abc/products/${this.products[ind].product_id}`, { method: 'DELETE' });
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
      let result = await fetch(`/admin/abc/products/${this.products[ind].product_id}`, {
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
    }
  }
});