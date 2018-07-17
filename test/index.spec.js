'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const request = require('supertest');
const { expect } = require('chai');
const cors = require('../src');

describe('koa2-cors test', () => {
  describe('default options', () => {
    const app = new Koa();
    const router = new Router();
    router.options('/test', (ctx) => {
      ctx.body = 'no content';
    });
    router.get('/test', (ctx) => {
      ctx.status = 200;
      ctx.body = { method: 'GET' };
    });
    app.use(cors());
    app.use(router.routes()).use(router.allowedMethods());

    it('should auto set `Access-Control-Allow-Origin` to `*` if not set request origin header', (done) => {
      request(app.listen())
        .get('/test')
        .expect({ method: 'GET' })
        .expect('Access-Control-Allow-Origin', '*')
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });

    it('should set `Access-Control-Allow-Origin` with request origin header', (done) => {
      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect({ method: 'GET' })
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });

    it('should return 204 status code on Preflight Request', done => {
      request(app.listen())
        .options('/test')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,HEAD,OPTIONS')
        .expect(204, done);
    });

    it('should not Preflight Request if request missing Access-Control-Request-Method Header', (done) => {
      request(app.listen())
        .options('/test')
        .set('Origin', 'http://koajs.com')
        .expect('no content')
        .expect(200, done);
    });
  });

  describe('options.origin = `*`', () => {
    const app = new Koa();
    const router = new Router();
    router.get('/test', (ctx) => {
      ctx.status = 200;
      ctx.body = { method: 'GET' };
    });
    app.use(cors({
      origin: '*',
    }));
    app.use(router.routes()).use(router.allowedMethods());

    it('should always set `Access-Control-Allow-Origin` to `*`', (done) => {
      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect({ method: 'GET' })
        .expect('Access-Control-Allow-Origin', '*')
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });
  });

  describe('options.origin is a function', () => {
    const app = new Koa();
    const router = new Router();
    router.get('/test', (ctx) => {
      ctx.status = 200;
      ctx.body = { method: 'GET' };
    });
    router.get('/test2', (ctx) => {
      ctx.status = 200;
      ctx.body = { method: 'GET' };
    });
    app.use(cors({
      origin(ctx) {
        if (ctx.url === '/test') {
          return false;
        }
        return '*';
      },
    }));
    app.use(router.routes()).use(router.allowedMethods());

    it('should disabled cors when origin() is falsy', (done) => {
      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect({ method: 'GET' })
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          expect(res.headers).to.not.have.property('access-control-allow-origin');
          done(err);
        });
    });

    it('should enable cors when origin() is `*`', (done) => {
      request(app.listen())
        .get('/test2')
        .set('Origin', 'http://koajs.com')
        .expect({ method: 'GET' })
        .expect('Access-Control-Allow-Origin', '*')
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          expect(res.headers).to.have.property('access-control-allow-origin');
          done(err);
        });
    });
  });

  describe('options.exposeHeaders', () => {
    const app = new Koa();
    const router = new Router();
    router.get('/test', (ctx) => {
      ctx.status = 200;
      ctx.body = { method: 'GET' };
    });
    app.use(cors({
      exposeHeaders: ['AAA', 'BBB'],
    }));
    app.use(router.routes()).use(router.allowedMethods());

    it('should set `Access-Control-Expose-Headers`', (done) => {
      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect({ method: 'GET' })
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Access-Control-Expose-Headers', 'AAA,BBB')
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });
  });

  describe('options.maxAge', () => {
    const app = new Koa();
    const router = new Router();
    router.get('/test', (ctx) => {
      ctx.status = 200;
      ctx.body = { method: 'GET' };
    });
    app.use(cors({
      maxAge: 1000,
    }));
    app.use(router.routes()).use(router.allowedMethods());

    it('should set `Access-Control-Max-Age` on Preflight Request', (done) => {
      request(app.listen())
        .options('/test')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Access-Control-Max-Age', '1000')
        .expect(204, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });

    it('should not set `Access-Control-Max-Age` on simple request', (done) => {
      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect({ method: 'GET' })
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          expect(res.headers).to.not.have.property('access-control-max-age');
          done(err);
        });
    });
  });

  describe('options.credentials', () => {
    const app = new Koa();
    const router = new Router();
    router.get('/test', (ctx) => {
      ctx.status = 200;
      ctx.body = { method: 'GET' };
    });
    app.use(cors({
      credentials: true,
    }));
    app.use(router.routes()).use(router.allowedMethods());

    it('should enable `Access-Control-Allow-Credentials` on Preflight Request', (done) => {
      request(app.listen())
        .options('/test')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect(204, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });

    it('should enable `Access-Control-Allow-Credentials` on simple request', (done) => {
      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect({ method: 'GET' })
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Credentials', 'true')
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });

    it('should disable `Access-Control-Allow-Credentials` on simple request when `origin` is set to `*`', (done) => {
      request(app.listen())
        .get('/test')
        .expect({ method: 'GET' })
        .expect('Access-Control-Allow-Origin', '*')
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          expect(res.headers).to.not.have.property('access-control-allow-credentials');
          done(err);
        });
    });
  });

  describe('options.allowMethods', () => {
    it('should set `Access-Control-Allow-Methods` correctly', (done) => {
      const app = new Koa();
      const router = new Router();
      router.get('/test', (ctx) => {
        ctx.status = 200;
        ctx.body = { method: 'GET' };
      });
      app.use(cors({
        allowMethods: ['GET', 'POST', 'PUT'],
      }));
      app.use(router.routes()).use(router.allowedMethods());

      request(app.listen())
        .options('/test')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Methods', 'GET,POST,PUT')
        .expect(204, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });

    it('should not set `Access-Control-Allow-Methods` when allowMethods is falsy', (done) => {
      const app = new Koa();
      const router = new Router();
      router.get('/test', (ctx) => {
        ctx.status = 200;
        ctx.body = { method: 'GET' };
      });
      app.use(cors({
        allowMethods: null,
      }));
      app.use(router.routes()).use(router.allowedMethods());

      request(app.listen())
        .options('/test')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect(204, (err, res) => {
          expect(err).to.be.null;
          expect(res.headers).to.not.have.property('access-control-allow-methods');
          done(err);
        });
    });
  });

  describe('options.allowHeaders', () => {
    it('should set `Access-Control-Allow-Headers` correctly', (done) => {
      const app = new Koa();
      const router = new Router();
      router.get('/test', (ctx) => {
        ctx.status = 200;
        ctx.body = { method: 'GET' };
      });
      app.use(cors({
        allowHeaders: ['TEST1', 'TEST2'],
      }));
      app.use(router.routes()).use(router.allowedMethods());

      request(app.listen())
        .options('/test')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Headers', 'TEST1,TEST2')
        .expect(204, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });

    it('should set `Access-Control-Allow-Headers` based on request `Access-Control-Request-Headers` header', (done) => {
      const app = new Koa();
      const router = new Router();
      router.get('/test', (ctx) => {
        ctx.status = 200;
        ctx.body = { method: 'GET' };
      });
      app.use(cors({}));
      app.use(router.routes()).use(router.allowedMethods());

      request(app.listen())
        .options('/test')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .set('Access-Control-Request-Headers', 'TEST1')
        .expect('')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Headers', 'TEST1')
        .expect(204, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });
  });

  describe('handle error', () => {
    const app = new Koa();
    const router = new Router();
    router.get('/test', (ctx) => {
      ctx.body = { method: 'GET' };
      throw new Error('Oops!');
    });
    app.use(cors({}));
    app.use(router.routes()).use(router.allowedMethods());

    it('should handle error on simple request', (done) => {
      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect('Internal Server Error')
        .expect(500, function (err, res) {
          expect(res.headers).to.not.have.property('access-control-allow-origin');
          done(err);
        });
    });

    it('should not handle error on Preflight Request', (done) => {
      request(app.listen())
        .options('/test')
        .set('Origin', 'http://koajs.com')
        .set('Access-Control-Request-Method', 'PUT')
        .expect('')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect(204, function (err, res) {
          expect(err).to.be.null;
          done(err);
        });
    });
  });

  describe('set `Vary: Origin` Header', () => {
    it('should set Vary Header', (done) => {
      const app = new Koa();
      const router = new Router();
      router.get('/test', (ctx) => {
        ctx.status = 200;
        ctx.body = { method: 'GET' };
      });
      app.use(cors({}));
      app.use(router.routes()).use(router.allowedMethods());

      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect({ method: 'GET' })
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Vary', 'Origin')
        .expect(200, function (err, res) {
          expect(err).to.be.null;
          done(err);
        });
    });

    it('should set Vary Header between other middleware', (done) => {
      const app = new Koa();
      const router = new Router();
      router.get('/test', (ctx) => {
        ctx.status = 200;
        ctx.body = { method: 'GET' };
      });
      app.use(async (ctx, next) => {
        ctx.vary('TEST1');
        await next();
      });
      app.use(cors({}));
      app.use(async (ctx, next) => {
        ctx.vary('TEST2');
        await next();
      });
      app.use(router.routes()).use(router.allowedMethods());

      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect({ method: 'GET' })
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect('Vary', 'TEST1, Origin, TEST2')
        .expect(200, function (err, res) {
          expect(err).to.be.null;
          done(err);
        });
    });
  });

});
