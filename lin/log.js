"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const lodash_1 = require("lodash");
const core_1 = require("./core");
const REG_XP = /(?<=\{)[^}]*(?=\})/g;
/**
 * 日志记录中间件
 * @param template 消息模板
 *
 * ```js
 * test.linGet(
 *  "getTestMsg",
 * "/json",
 *  {
 *   auth: "hello",
 *   module: "world",
 *   mount: true
 * },
 * loginRequired,
 * logger("{user.nickname}就是皮了一波"),
 * async ctx => {
 *   ctx.json({
 *     msg: "物质决定意识，经济基础决定上层建筑"
 *   });
 *  }
 * );
 * ```
 */
exports.logger = (template) => {
    return async (ctx, next) => {
        await next();
        // 取数据，写入到日志中
        writeLog(template, ctx);
    };
};
function writeLog(template, ctx) {
    const message = parseTemplate(template, ctx.currentUser, ctx.response, ctx.request);
    if (ctx.matched) {
        const info = util_1.findAuthAndModule(ctx);
        let auth = '';
        if (info) {
            auth = lodash_1.get(info, 'auth');
        }
        const statusCode = ctx.status || 0;
        // @ts-ignore
        core_1.Log.createLog({
            message: message,
            user_id: ctx.currentUser.id,
            user_name: ctx.currentUser.nickname,
            status_code: statusCode,
            method: ctx.request.method,
            path: ctx.request.path,
            authority: auth
        }, true);
    }
}
/**
 * 解析模板
 * @param template 消息模板
 * @param user 用户
 * @param reponse
 * @param request
 */
function parseTemplate(template, user, reponse, request) {
    const res = REG_XP.exec(template);
    if (res) {
        res.forEach(item => {
            const index = item.lastIndexOf('.');
            util_1.assert(index !== -1, item + '中必须包含 . ,且为一个');
            const obj = item.substring(0, index);
            const prop = item.substring(index + 1, item.length);
            let it;
            switch (obj) {
                case 'user':
                    it = lodash_1.get(user, prop, '');
                    break;
                case 'response':
                    it = lodash_1.get(reponse, prop, '');
                    break;
                case 'request':
                    it = lodash_1.get(request, prop, '');
                    break;
                default:
                    it = '';
                    break;
            }
            template = template.replace(`{${item}}`, it);
        });
    }
    return template;
}
exports.parseTemplate = parseTemplate;
