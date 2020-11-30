<template>
  <div>
    <h2 v-if="loading">Loading...</h2>
    <h2 v-else>Balance: ${{ balance }}</h2>
    <div class="row">
      <div v-if="!loading" class="col-md-6">
        <div class="input-group mb-6">
          <input type="number" class="form-control" v-model="newBalance">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="balanceSet()">Set</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    balance: 0,
    newBalance: 0
  }),
  async mounted() {
    let data = await fetch(`/admin/${this.$store.state.key}/balance`);
    this.newBalance = (await data.json()).balance;
    this.balance = this.newBalance.toFixed(2);
    this.loading = false;
  },
  methods: {
    async balanceSet() {
      this.loading = true;
      let result = await fetch(`/admin/${this.$store.state.key}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          balance: Number(this.newBalance)
        })
      });
      if (result.status === 200) {
        let { balance } = await result.json();
        this.balance = balance.toFixed(2);
      }
      this.loading = false;
    }
  }
};
</script>