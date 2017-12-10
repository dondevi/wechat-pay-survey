/**
 * =============================================================================
 *  Main
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-06
 *
 */

import Vue from "vue";

// Initial Nomalize.css
import "normalize.css";

// Initial Axios
import axios from "axios";
Vue.prototype.$axios = axios;

// Initial Mint UI
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
Vue.use(MintUI);

// Initial app & router
import router from "router/index.js";
import app from "layouts/app.vue";
new Vue({ router, render: h => h(app) }).$mount("#app");
