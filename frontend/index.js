import Vue from 'vue';
import VueRouter from 'vue-router';

import Layout from './layout.vue';

import Index from './pages/index.vue';
import Api from './pages/api.vue';
import Finance from './pages/finance.vue';
import Pending from './pages/pending.vue';
import Received from './pages/received.vue';
import Returned from './pages/returned.vue';
import Shipped from './pages/shipped.vue';
import Warehouse from './pages/warehouse.vue';

import store from './store';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Index },
  { path: '/api', component: Api },
  { path: '/finance', component: Finance },
  { path: '/pending', component: Pending },
  { path: '/received', component: Received },
  { path: '/returned', component: Returned },
  { path: '/shipped', component: Shipped },
  { path: '/warehouse', component: Warehouse }
];
const router = new VueRouter({ routes });
new Vue({
  router,
  store,
  render: h => h(Layout)
}).$mount('#app');