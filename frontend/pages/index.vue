<template>
  <div>
    <h2>Welcome</h2>
    <div>This mimics the <a href="https://www.dshipchina.com/api.html" target="_blank">DShipChina Fulfillment API</a>.</div>
    <hr />
    <h3>API Key</h3>
    <div>Multiple keys are supported and isolated from each other. Set the key used by this frontend below.</div>
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
      <h3>Use real shipping data</h3>
      You can use more accurate shipping rates by getting the values from DShipChina. Save the values from <a href="https://www.dshipchina.com/api4/getshiprate.php?key=" target="_blank">getshiprate.php</a> (fill in your own API key) into a file called <code>getshiprate.json</code> in the root directory of dshipchina-mock and restart the server.<br />
    </div>
  </div>
</template>

<script>
export default {
  data: ({ $store }) => ({
    origin: location.origin,
    key: $store.state.key
  })
}
</script>