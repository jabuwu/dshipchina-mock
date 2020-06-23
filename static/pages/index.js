const Index = Vue.component('index', {
  template: `
    <div>
      <h2>Welcome</h2>
      <div>This mock supports the <a href="https://www.dshipchina.com/api.html" target="_blank">DShipChina Fulfillment API</a>, <i>for the most part</i>. Use the key <code>abc</code> (see below). Multiple keys are supported and isolated from each other, but this admin UI only supports the <code>abc</code> key.</div>
      <hr />
      <div>
        <h3>Example API call</h3>
        <code>http://localhost:3333/api1/getallproducts.php?key=abc</code>
      </div>
      <hr />
      <div>
        <h3>Use real shipping data</h3>
        You can use more accurate shipping rates by getting the values from DShipChina. Save the values from <a href="https://www.dshipchina.com/api4/getshiprate.php?key=" target="_blank">getshiprate.php</a> (fill in your own API key) into a file called <code>getshiprate.json</code> in the root directory of dshipchina-mock and restart the server.<br />
      </div>
    </div>
  `
});
