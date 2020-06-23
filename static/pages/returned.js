const Returned = Vue.component('returned', {
  template: `
    <div>
      <h1>Returned</h1>
      <div v-if="loading" class="text-center mt-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else>
        <order-table :orders="orders" :shipped="true" :status="60" @reset="reset($event)" />
      </div>
    </div>
  `,
  data: () => ({
    loading: true,
    orders: []
  }),
  async mounted() {
    let data = await fetch('/admin/abc/orders');
    this.orders = (await data.json()).orders;
    for (let order of this.orders) {
      prepareOrder(order);
    }
    this.orders.reverse();
    this.loading = false;
  },
  methods: {
    async reset(obj) {
      await fetch(`/admin/abc/orders/${this.orders[obj.ind].waybill_id}/reset`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      this.orders.splice(obj.ind, 1);
    }
  }
});