import { Context } from 'koa';
/**
 * 全局异常处理中间件
 */
export declare const error: (err: Error, ctx: Context) => void;
/**
 * 全局日志记录，且判断状态码，发出相应的异常
 */
export declare const log: (ctx: Context, next: () => Promise<any>) => Promise<void>;
