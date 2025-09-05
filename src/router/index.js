import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "LoginPage",
      // component:()=>import('../pages/User-login-v3.vue')
      component: () => import("../pages/portal/LoginPage.vue"),
    },
  ],
});
