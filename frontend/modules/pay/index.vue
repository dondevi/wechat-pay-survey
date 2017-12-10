<!--
/**
 * =============================================================================
 *  Wechat pay
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-06
 *
 * @update 2017-09-15 dondevi
 */
-->

<template>
  <main>

    <h2>{{ wxcode }}</h2>
    <p> <mt-button type="primary" @click="h5Pay">H5 支付</mt-button> </p>
    <p> <mt-button type="primary" @click="jsPay">JSSDK 支付</mt-button> </p>
    <p> <mt-button type="primary" @click="iframe">iFrame 支付</mt-button> </p>
    <p> <mt-button type="primary" @click="redirect">Redirect 支付</mt-button> </p>

    <br><br>
    <p><a href="http://(Your LAN IP):8101/(Your proxy path if need)">获取 Access Token 1</a></p>
    <p><a href="http://(Your LAN IP):8101/(Your proxy path if need)?wxcode=example">获取 Access Token 2</a></p>

    <mt-popup v-model="popup" position="right">
      <iframe :src="url" v-if="url"></iframe>
    </mt-popup>

  </main>
</template>





<script>

  import axios from "axios";
  import { MessageBox } from "mint-ui";
  import { PROXY_ADDR } from "configs";
  import minxin from "./mixin";


  export default {

    mixins: [minxin],

    data: () => ({
      popup: false,
      url:   "",
    }),

    methods: {
      iframe () {
        if (this.url) { return (this.popup = true); }
        MessageBox.confirm("是否继续尝试", "ifram内无法调起微信支付").then(action => {
          if ("confirm" === action) {
            this.popup = true;
            this.url = PROXY_ADDR + "?wxcode=example#/iframe";
          }
        }).catch(error => console.log(error));
      },
      redirect () {
        window.location = PROXY_ADDR + "?wxcode=example#/iframe";
      },
    },

  };

</script>





<style scoped>
  main {
    text-align: center;
  }
  h2 {
    margin: 50px 0;
  }
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  a {
    color: #aaa;
    text-decoration: none;
  }
  .mint-popup-right {
    width: 80%;
    height: 100%;
  }
  .mint-button {
    width: 60%;
  }
</style>
