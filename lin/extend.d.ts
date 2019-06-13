import Application from 'koa';
/**
 * json序列化扩展
 *
 * ```js
 * ctx.json({ msg:"hello from lin!" })
 * ```
 *
 * @param app app实例
 */
export declare const json: (app: Application<any, {}>) => void;
/**
 * 处理success
 *
 * ```js
 * ctx.success({ msg:"hello from lin!" })
 * ```
 *
 * ```js
 * ctx.success({ code: 200, msg: "hello from lin!", errorCode: 10000 })
 * ```
 *
 * @param app app实例
 */
export declare const success: (app: Application<any, {}>) => void;
/**
 * 日志扩展
 *
 * ```js
 * ctx.logger.info();
 * ctx.logger.warn();
 * ctx.logger.debug();
 * ctx.logger.error();
 * ```
 *
 * @param app app实例
 */
export declare const logging: (app: Application<any, {}>) => void;
export interface MulOpts {
    autoFields?: boolean;
    singleLimit?: number;
    totalLimit?: number;
    fileNums?: number;
    include?: string[];
    exclude?: string[];
}
/**
 * 解析上传文件
 * @param app app实例
 */
export declare const multipart: (app: Application<any, {}>) => void;
