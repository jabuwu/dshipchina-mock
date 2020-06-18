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
              <th scope="col">Name</th>
              <th scope="col">Note</th>
              <th scope="col">Customs Declaration</th>
              <th scope="col">Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, ind) of products" :key="product.product_id">
              <th scope="row">{{ product.product_id }}</th>
              <td>N/A</td>
              <td><input v-model="product.sku" /></td>
              <td>{{ product.inventory }}</td>
              <td>{{ product.weight || 0 }}g<br />{{ product.width || 0 }} x {{ product.length || 0 }} x {{ product.height || 0 }} cm</td>
              <td><input v-model="product.product_name" /></td>
              <td><input v-model="product.note" /></td>
              <td>Name (English)<br /><input v-model="product.declare_name" /><br />Name (Chinese)<br /><input v-model="product.declare_name_cn" /><br />Unit Value (USD)<br /><input v-model="product.declare_value" /></td>
              <td><button type="button" class="btn btn-danger" @click="productDelete(ind)" :disabled="product.busy">Delete</button></td>
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
      product.declare_name = product.declare_name == null ? '0' : product.declare_name;
      product.declare_name_cn = product.declare_name_cn == null ? '0' : product.declare_name_cn;
      product.declare_value = product.declare_value.toFixed(2)
      product.busy = false;
    }
    this.products.reverse();
    this.loading = false;
  },
  methods: {
    async productCreate() {
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
    }
  }
});