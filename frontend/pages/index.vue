<template>
  <div>
    <h2>Welcome</h2>
    <p>This mimics the <a href="https://www.dshipchina.com/api.html" target="_blank">DShipChina Fulfillment API</a>.</p>
    <hr />
    <h3>API Key</h3>
    <p>Multiple keys are supported and isolated from each other. Set the key used by this frontend below.</p>
    <div class="input-group mt-3">
      <div class="input-group-prepend">
        <span class="input-group-text">?key=</span>
      </div>
      <input type="text" class="form-control" placeholder="API Key" v-model="key" @keyup="$store.commit('setKey', { key })" @change="$store.commit('setKey', { key })" />
    </div>
    <hr />
    <div>
      <h3>Example API call</h3>
      <code>{{ origin }}/api1/getallproducts.php?key={{ $store.state.key }}</code>
    </div>
    <hr />
    <div>
      <h3>Utilities</h3>
      <p>Enter your <b>real</b> DShipChina API key below. You can use more accurate shipping rates by getting the values directly from DShipChina by pressing "Fetch Shipping Rates". You can import your existing products by pressing "Import Products".</p>
      <div class="input-group mt-3">
        <div class="input-group-prepend">
          <span class="input-group-text">dshipchina.com?key=</span>
        </div>
        <input type="text" class="form-control" placeholder="API Key" v-model="realKey" />
      </div>
      <button v-if="fetchStatus == 'none'" type="button" class="btn btn-primary btn-lg mt-3" :disabled="!realKeyValid" @click="fetchRates()">Fetch Shipping Rates</button>
      <button v-else-if="fetchStatus == 'fetching'" type="button" class="btn btn-secondary btn-lg mt-3" :disabled="true">Fetching...</button>
      <button v-else-if="fetchStatus == 'success'" type="button" class="btn btn-success btn-lg mt-3" :disabled="!realKeyValid" @click="fetchRates()">Success!</button>
      <button v-else-if="fetchStatus == 'fail'" type="button" class="btn btn-danger btn-lg mt-3" :disabled="!realKeyValid" @click="fetchRates()">Failed To Fetch</button>
      <button v-if="importStatus == 'none'" type="button" class="btn btn-primary btn-lg mt-3" :disabled="!realKeyValid" @click="importProducts()">Import Products</button>
      <button v-else-if="importStatus == 'importing'" type="button" class="btn btn-secondary btn-lg mt-3" :disabled="true">Importing...</button>
      <button v-else-if="importStatus == 'success'" type="button" class="btn btn-success btn-lg mt-3" :disabled="!realKeyValid" @click="importProducts()">Success!</button>
      <button v-else-if="importStatus == 'fail'" type="button" class="btn btn-danger btn-lg mt-3" :disabled="!realKeyValid" @click="importProducts()">Failed To Import</button>
    </div>
    <hr />
  </div>
</template>

<script>
export default {
  data: ({ $store }) => ({
    origin: location.origin,
    key: $store.state.key,
    realKey: '',
    fetchStatus: 'none',
    importStatus: 'none'
  }),
  computed: {
    realKeyValid() {
      return this.realKey.length == 32;
    }
  },
  methods: {
    async fetchRates() {
      try {
        this.fetchStatus = 'fetching';
        let result = await fetch(`/admin/getshiprate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            realKey: this.realKey
          })
        });
        let json = await result.json();
        if (json.success) {
          this.fetchStatus = 'success';
        } else {
          this.fetchStatus = 'fail';
        }
      } catch {
        this.fetchStatus = 'fail';
      } finally {
        setTimeout(() => {
          this.fetchStatus = 'none';
        }, 1500);
      }
    },
    async importProducts() {
      if (confirm(`This will delete all data for key "${this.$store.state.key}" and replace them with your live products. Are you sure you want to do this?`)) {
        try {
          this.importStatus = 'importing';
          let result = await fetch(`/admin/importproducts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              realKey: this.realKey,
              key: this.$store.state.key
            })
          });
          let json = await result.json();
          if (json.success) {
            this.importStatus = 'success';
          } else {
            this.importStatus = 'fail';
          }
        } catch {
          this.importStatus = 'fail';
        } finally {
          setTimeout(() => {
            this.importStatus = 'none';
          }, 1500);
        }
      }
    }
  }
}
</script>