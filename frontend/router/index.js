/**
 * =============================================================================
 *  Router 路由
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-06
 *
 */

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import pay from "src/modules/pay";
import iframe from "src/modules/pay/iframe";

const routes = [
  { path: "/", component: pay },
  { path: "/iframe", component: iframe },
];

const router = new VueRouter({ routes });

export default router;
