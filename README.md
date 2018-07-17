# koa2-cors

[![NPM version][npm-image]][npm-url]
[![Node version][node-version-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Code coverage][codecov-image]][codecov-url]
[![NPM download][npm-download-image]][npm-url]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## install

> it requires node v7.6.0 or higher now

```bash
npm install --save koa2-cors
```

## Usage

```js
var Koa = require('koa');
var cors = require('koa2-cors');

var app = new Koa();
app.use(cors());
```

## Options

### origin

Configures the **Access-Control-Allow-Origin** CORS header. expects a string. Can also be set to a function, which takes the `ctx` as the first parameter.

### exposeHeaders

Configures the **Access-Control-Expose-Headers** CORS header. Expects a comma-delimited array.

### maxAge

Configures the **Access-Control-Max-Age** CORS header. Expects a
Number.

### credentials

Configures the **Access-Control-Allow-Credentials** CORS header. Expects a Boolean.

### allowMethods

Configures the **Access-Control-Allow-Methods** CORS header. Expects a comma-delimited array , If not specified, default allowMethods is `['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']`.

### allowHeaders
Configures the **Access-Control-Allow-Headers** CORS header. Expects a comma-delimited array . If not specified, defaults to reflecting the headers specified in the request's **Access-Control-Request-Headers** header.

```js
var Koa = require('koa');
var cors = require('koa2-cors');

var app = new Koa();
app.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return false;
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
...
```

[More details about CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

[npm-image]: https://img.shields.io/npm/v/koa2-cors.svg
[npm-download-image]: https://img.shields.io/npm/dm/koa2-cors.svg
[node-version-image]: https://img.shields.io/node/v/koa2-cors.svg
[npm-url]: https://www.npmjs.com/package/koa2-cors

[travis-image]: https://api.travis-ci.org/zadzbw/koa2-cors.svg?branch=master
[travis-url]: https://travis-ci.org/zadzbw/koa2-cors

[codecov-image]: https://codecov.io/gh/zadzbw/koa2-cors/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/zadzbw/koa2-cors
