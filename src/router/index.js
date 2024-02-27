import { createRouter, createWebHashHistory } from "vue-router";
//import MainPage from "../MainPage.vue";
import MainMonthly from "../MainMonthly.vue";
import MainDaily from "../MainDaily.vue"
//import UpdateView from "../UpdateView.vue"
//import MainPost from "../MainPost.vue"
// import MainTest from "../MainTest.vue"

const routes = [
  { path: '/', redirect: "/monthly" },
 // { path: '/main', component: MainPage },
  { path: '/monthly', component: MainMonthly },
  { path: '/daily', component: MainDaily },
  // { path: '/test', component: MainTest },
  //{ path: '/maintable', component: MainTable },
 // { path: '/updateview/:Id', component: UpdateView },
  //{ path: '/mainpost', component: MainPost },
  // { path: '/report', component: ViewReport },
  // { path: '/report/:Id', component: ViewReport },
];

const router = createRouter({
	history: createWebHashHistory(),
	linkActiveClass: "active",
	routes,
});

export default router;
