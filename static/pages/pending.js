const Pending = Vue.component('pending', {
  template: `
    <div>
      <h1>Pending</h1>
      <div v-if="loading" class="text-center mt-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else>
        <order-table :orders="orders" :shipped="false" :status="30" @ship="ship($event)" @cancel="cancel($event)" />
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
    async ship(obj) {
      await fetch(`/admin/abc/orders/${this.orders[obj.ind].waybill_id}/ship`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tracking: obj.tracking
        })
      });
      this.orders.splice(obj.ind, 1);
    },
    async cancel(obj) {
      await fetch(`/admin/abc/orders/${this.orders[obj.ind].waybill_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.orders.splice(obj.ind, 1);
    }
  }
});