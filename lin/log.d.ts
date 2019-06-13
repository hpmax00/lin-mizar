/// <reference types="koa-bodyparser" />
import { IRouterContext } from 'koa-router';
import { Response, Request } from 'koa';
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
export declare const logger: (template: string) => (ctx: IRouterContext, next: () => Promise<any>) => Promise<void>;
/**
 * 解析模板
 * @param template 消息模板
 * @param user 用户
 * @param reponse
 * @param request
 */
export declare function parseTemplate(template: string, user: any, reponse: Response, request: Request): string;
