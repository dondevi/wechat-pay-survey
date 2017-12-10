<!--
/**
 * =============================================================================
 *  Wechat pay in iframe
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-09-15
 *
 */
-->

<template>
  <main>

    <h2>{{ wxcode }}</h2>
    <p> <mt-button type="primary" @click="h5Pay">H5 支付</mt-button> </p>
    <p> <mt-button type="primary" @click="jsPay">JSSDK 支付</mt-button> </p>

  </main>
</template>



<script>
  import minxin from "./mixin";
  export default {
    mixins: [minxin],
  };
</script>



<style scoped>
  main {
    text-align: center;
  }
  h2 {
    margin: 50px 0;
  }
  script + div > div {
    visibility: hidden;
  }
  .mint-button {
    width: 80%;
  }
</style>
