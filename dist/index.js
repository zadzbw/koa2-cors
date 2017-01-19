'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * CORS middleware for koa2
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Array} allowMethods `Access-Control-Allow-Methods`, default is ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS']
 *  - {Array} allowHeaders `Access-Control-Allow-Headers`
 * @return {Function}
 * @api public
 */
module.exports = function crossOrigin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var defaultOptions = {
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS']
  };

  // set defaultOptions to options
  for (var key in defaultOptions) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaultOptions[key];
    }
  }

  return function () {
    var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(ctx, next) {
      var origin;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              origin = void 0;

              if (typeof options.origin === 'function') {
                origin = options.origin(ctx);
              } else {
                origin = options.origin || ctx.get('Origin') || '*';
              }

              if (origin) {
                _context.next = 6;
                break;
              }

              _context.next = 5;
              return next();

            case 5:
              return _context.abrupt('return', _context.sent);

            case 6:

              // Access-Control-Allow-Origin
              ctx.set('Access-Control-Allow-Origin', origin);

              if (!(ctx.method === 'OPTIONS')) {
                _context.next = 19;
                break;
              }

              if (ctx.get('Access-Control-Request-Method')) {
                _context.next = 12;
                break;
              }

              _context.next = 11;
              return next();

            case 11:
              return _context.abrupt('return', _context.sent);

            case 12:

              // Access-Control-Max-Age
              if (options.maxAge) {
                ctx.set('Access-Control-Max-Age', String(options.maxAge));
              }

              // Access-Control-Allow-Credentials
              if (options.credentials === true) {
                // When used as part of a response to a preflight request,
                // this indicates whether or not the actual request can be made using credentials.
                ctx.set('Access-Control-Allow-Credentials', 'true');
              }

              // Access-Control-Allow-Methods
              if (options.allowMethods) {
                ctx.set('Access-Control-Allow-Methods', options.allowMethods.join(','));
              }

              // Access-Control-Allow-Headers
              if (options.allowHeaders) {
                ctx.set('Access-Control-Allow-Headers', options.allowHeaders.join(','));
              } else {
                ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
              }

              ctx.status = 204; // No Content
              _context.next = 29;
              break;

            case 19:
              // Request
              // Access-Control-Allow-Credentials
              if (options.credentials === true) {
                if (origin === '*') {
                  // `credentials` can't be true when the `origin` is set to `*`
                  ctx.remove('Access-Control-Allow-Credentials');
                } else {
                  ctx.set('Access-Control-Allow-Credentials', 'true');
                }
              }

              // Access-Control-Expose-Headers
              if (options.exposeHeaders) {
                ctx.set('Access-Control-Expose-Headers', options.exposeHeaders.join(','));
              }

              _context.prev = 21;
              _context.next = 24;
              return next();

            case 24:
              _context.next = 29;
              break;

            case 26:
              _context.prev = 26;
              _context.t0 = _context['catch'](21);
              throw _context.t0;

            case 29:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[21, 26]]);
    }));

    return function (_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};