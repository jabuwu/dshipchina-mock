const routes = [
  { path: '/finance', component: Finance },
  { path: '/warehouse', component: Warehouse }
];
const router = new VueRouter({ routes });
const app = new Vue({ router }).$mount('#app');