"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * inspired by koa-simple-ratelimit
 * @see https://github.com/scttcper/koa-simple-ratelimit
 */
const ms_1 = tslib_1.__importDefault(require("ms"));
const exception_1 = require("../exception");
/**
 * find p in redis
 * @param db redis client
 * @param p key
 */
function find(db, p) {
    return new Promise((resolve, reject) => {
        db.get(p, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    });
}
/**
 * get expire time in redis for p
 * @param db redis client
 * @param p key
 */
function pttl(db, p) {
    return new Promise((resolve, reject) => {
        db.pttl(p, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    });
}
/**
 * Initialize ratelimit middleware with the given `opts`
 */
function ratelimit(options) {
    const opts = Object.assign({ max: 2500, duration: 3600000, throw: false, prefix: 'limit', endpoint: '', id: (ctx) => ctx.ip, whitelist: [], blacklist: [], headers: {
            remaining: 'X-RateLimit-Remaining',
            reset: 'X-RateLimit-Reset',
            total: 'X-RateLimit-Limit'
        }, errorMessage: (exp, url) => {
            return {
                error_code: 10140,
                msg: `请求过于频繁，请在${ms_1.default(exp, { long: true })}后重试`,
                url: url
            };
        }, logging: true }, options);
    const { remaining = 'X-RateLimit-Remaining', reset = 'X-RateLimit-Reset', total = 'X-RateLimit-Limit' } = opts.headers || {};
    return async function (ctx, next) {
        const id = opts.id(ctx);
        if (id === false) {
            return next();
        }
        // Whitelist
        if (opts.whitelist && opts.whitelist.includes(id)) {
            return next();
        }
        // Blacklist
        if (opts.blacklist && opts.blacklist.includes(id)) {
            throw new exception_1.Forbidden({ msg: '您的访问被禁止' });
        }
        const endpoint = opts.endpoint ? opts.endpoint : '';
        const prefix = opts.prefix ? opts.prefix : 'limit';
        const name = `${prefix}:${endpoint}:${id}:count`;
        const cur = await find(opts.db, name);
        const n = Math.floor(Number(cur));
        let t = Date.now();
        t += opts.duration;
        t = new Date(t).getTime() / 1000 || 0;
        const headers = {
            [remaining]: opts.max - 1,
            [reset]: t,
            [total]: opts.max
        };
        ctx.set(headers);
        // Not existing in redis
        // tslint:disable-next-line: strict-type-predicates
        if (cur === null) {
            opts.db.set(name, opts.max - 1, 'PX', opts.duration, 'NX');
            opts.logging &&
                ctx.logger.info('remaining %s/%s %s', opts.max - 1, opts.max, id);
            return next();
        }
        const expires = await pttl(opts.db, name);
        if (n - 1 >= 0) {
            // Existing in redis
            opts.db.decr(name);
            ctx.set(remaining, n - 1);
            opts.logging &&
                ctx.logger.info('remaining %s/%s %s', n - 1, opts.max, id);
            return next();
        }
        if (expires < 0) {
            opts.logging && ctx.logger.info(`${name} is stuck. Resetting.`);
            opts.db.set(name, opts.max - 1, 'PX', opts.duration, 'NX');
            return next();
        }
        // User maxed
        opts.logging &&
            ctx.logger.info('remaining %s/%s %s', remaining, opts.max, id);
        ctx.set(remaining, n);
        ctx.set('Retry-After', t);
        // 没有被next，则报错
        ctx.status = 429;
        if (typeof opts.errorMessage === 'function') {
            ctx.body = opts.errorMessage(expires, ctx.req.url);
        }
        else {
            ctx.body = opts.errorMessage;
        }
        if (opts.throw) {
            throw new exception_1.LimitException();
        }
    };
}
exports.ratelimit = ratelimit;
