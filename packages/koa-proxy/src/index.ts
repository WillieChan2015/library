import koaProxy, { IOptions } from 'koa-better-http-proxy';
import { pathToRegexp } from 'path-to-regexp';

import type { Context, Next } from 'koa';

interface ProxyOptions extends IOptions {
  target: string;
}

interface IProxyMiddlewareOpts {
  target: Record<string, ProxyOptions>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export function proxy(options: ProxyOptions) {
  return async function (ctx: Context, next: Next = noop as Next) {
    const { target, ...rest } = options;
    await koaProxy(target, rest)(ctx, next);
  };
}

export function proxyMiddleware(options: IProxyMiddlewareOpts) {
  const { target = {} } = options;

  const routeRegArr: [RegExp, string][] = [];
  for (const route of Object.keys(target)) {
    routeRegArr.push([pathToRegexp(route), route]);
  }

  return async (ctx: Context, next: Next) => {
    const { path } = ctx;
    for (const [reg, route] of routeRegArr) {
      if (reg.test(path)) {
        const opts = target[route];
        return proxy(opts)(ctx, next);
      }
    }
    return next();
  };
}
