# `koa-proxy`
koa 代理/转发插件

支持在具体的某个请求处理函数(controller)内使用或者当做中间件使用

## 1. proxy
单个请求代理，可做中间件，也可在具体的某个请求处理函数(controller)内使用

## 2. proxyMiddleware
中间件，可通过配置 proxyTable 形式对多个不同的接口进行转发

### 2.1 代理地址
路径书写格式参考 [Path-to-RegExp](https://www.npmjs.com/package/path-to-regexp)

## 3. example
```js
const Koa = require('koa');
const bodyparser = require('koa-body');
const { proxy, proxyMiddleware } = require('@williechen/koa-proxy');

const app = new Koa();

app.use(bodyparser());

// 单个请求代理
app.use(async (ctx, next) => {
  if (ctx.path === '/api/test') {
    await proxy({
      target: 'http://localhost:4003',
    })(ctx);
  } else {
    return next();
  }
});

// 中间件代理
app.use(proxyMiddleware({
  target: {
    '/api/(.*)': {
      target: 'http://localhost:4004',
    }
  },
}));
```
