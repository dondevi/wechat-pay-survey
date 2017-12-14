<!--
/**
 * @author dondevi
 * @create 2017-09-06
 */
-->

# Wechat Pay Survey

## Init

- Config Wechat Official Account setting in `backend/configs`
- Config Proxy path in `devServer.publicPath` of `cooking.conf.js`, if you need to run in WAN


## Run
> http://localhost:8101

```shell
  npm run dev
```

## Plan

- 0.1.0 Proved  H5 pay without JSSDK
- 0.2.0 Emulate different Wechat offical account
- 0.3.0 Linkage different OpenID by UnionID
- 0.4.0 Proved  H5 pay in another offical account
- 0.5.0 Implete Qrcode pay
