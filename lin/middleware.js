"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = require("./exception");
/**
 * 全局异常处理中间件
 */
exports.error = (err, ctx) => {
    ctx.type = 'application/json';
    if (err instanceof exception_1.HttpException) {
        ctx.status = err.code || 500;
        ctx.body = JSON.stringify({
            error_code: err.errorCode,
            msg: err.msg,
            url: ctx.req.url
        });
    }
    else {
        ctx.logger.error(err);
        ctx.body = JSON.stringify({
            error_code: 999,
            msg: '服务器未知错误',
            url: ctx.req.url
        });
    }
};
/**
 * 全局日志记录，且判断状态码，发出相应的异常
 */
exports.log = async (ctx, next) => {
    const start = Date.now();
    try {
        await next();
        const ms = Date.now() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
        ctx.logger.info(`[${ctx.method}] -> [${ctx.url}] from: ${ctx.ip} costs: ${ms}ms`);
        if (ctx.status === 404) {
            ctx.app.emit('error', new exception_1.NotFound(), ctx);
        }
        else if (ctx.status === 405) {
            ctx.app.emit('error', new exception_1.MethodNotAllowed(), ctx);
        }
        else if (!ctx.body) {
            ctx.app.emit('error', new exception_1.HttpException({ msg: ctx.message }), ctx);
        }
    }
    catch (err) {
        ctx.status = ctx.status || 500;
        ctx.app.emit('error', err, ctx);
    }
};
