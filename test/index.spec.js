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
    router.get('/test', (ctx) => {
      ctx.body = { a: 1 };
    });
    app.use(cors());
    app.use(router.routes()).use(router.allowedMethods());

    it('should auto set `Access-Control-Allow-Origin` to `*` when request Origin header missing', (done) => {
      request(app.listen())
        .get('/test')
        .expect({ a: 1 })
        .expect('Access-Control-Allow-Origin', '*')
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });

    it('should set `Access-Control-Allow-Origin` to request origin header', (done) => {
      request(app.listen())
        .get('/test')
        .set('Origin', 'http://koajs.com')
        .expect('Access-Control-Allow-Origin', 'http://koajs.com')
        .expect({ a: 1 })
        .expect(200, (err, res) => {
          expect(err).to.be.null;
          done(err);
        });
    });
  });
});
