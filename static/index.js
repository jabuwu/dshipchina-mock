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
const app = new Vue({ router }).$mount('#app');