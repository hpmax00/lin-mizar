import { IRouterContext } from 'koa-router';
export declare const isUndefined: (obj: any) => obj is undefined;
export declare const isFunction: (fn: any) => boolean;
export declare const isObject: (fn: any) => fn is object;
export declare const isString: (fn: any) => fn is string;
export declare const isConstructor: (fn: string) => boolean;
export declare const validatePath: (path?: string | undefined) => string;
export declare const isNil: (obj: null) => boolean;
export declare const isEmpty: (array: {
    length: number;
}) => boolean;
export declare const isSymbol: (fn: any) => fn is symbol;
export declare const strVal: (value: any) => string;
export declare const isNotEmpty: (value: any) => boolean;
export declare const isNegative: (value: number) => boolean;
export declare const isPositive: (value: number) => boolean;
/**
 * Assertion utility.
 */
export declare function assert(ok: boolean, ...args: string[]): void;
export declare function toHump(name: string): string;
export declare function toLine(name: string): string;
/**
 * 通过当前的路由名找到对应的权限录入信息
 * @param ctx koa 的 context
 */
export declare function findAuthAndModule(ctx: IRouterContext): any;
export declare function findMetaByAuth(auth: any): any;
/**
 * 检查日期的格式为 "YYYY-MM-DD HH:mm:ss"
 * @param time input time
 */
export declare function checkDateFormat(time: string): boolean;
export declare function paginate(ctx: IRouterContext): {
    start: any;
    count: any;
};
export declare function unsets(obj: any, props: Array<string>): void;
/**
 *  在js中使用装饰器语法的语法糖函数
 * @param {*} decorators 装饰器
 * @param {*} type 被装饰值的类型 String | Array
 * @param {*} target 被装饰类的原型
 * @param {*} key 被装饰器类的键
 *
 * ```js
 * tslib.__decorate([
 * Length(2, 20, {
 *  message: "昵称长度必须在2~10之间"
 * }),
 * IsNotEmpty({
 *  message: "昵称不可为空"
 * }),
 * tslib.__metadata("design:type", String)
 * ] , RegisterForm.prototype, "nickname", void 0);
 * // 可被转化为
 * decorate(
 * [Length(2, 20, {
 *  message: "昵称长度必须在2~10之间"
 * }),
 *  IsNotEmpty({
 *  message: "昵称不可为空"
 * })],
 * String,
 * RegisterForm.prototype,
 * "nickname"
 * )
 * ```
 */
export declare function decorateProp(decorators: any, type: any, target: any, key: any): any;
export interface ObjOptions {
    prefix?: string;
    filter?: (key: any) => boolean;
}
/**
 * 获取一个实例的所有方法
 * @param obj 对象实例
 * @param option 参数
 *
 * ```js
 *     let validateFuncKeys: string[] = getAllMethodNames(this, {
 *     filter: key =>
 *   /validate([A-Z])\w+/g.test(key) && typeof this[key] === "function"
 *  });
 * ```
 */
export declare function getAllMethodNames(obj: any, option?: ObjOptions): any[];
/**
 * 获得实例的所有字段名
 * @param obj 实例
 * @param option 参数项
 *
 * ```js
 *     let keys = getAllFieldNames(this, {
 *      filter: key => {
 *    const value = this[key];
 *    if (isArray(value)) {
 *      if (value.length === 0) {
 *      return false;
 *    }
 *    for (const it of value) {
 *       if (!(it instanceof Rule)) {
 *         throw new Error("every item must be a instance of Rule");
 *      }
 *    }
 *    return true;
 *   } else {
 *    return value instanceof Rule;
 *    }
 *   }
 *  });
 * ```
 */
export declare function getAllFieldNames(obj: any, option?: ObjOptions): any[];
/**
 * 获取文件夹下所有文件名
 * @param dir 文件夹
 */
export declare function getFiles(dir: string): string[];
/**
 * 递归创建目录 同步方法
 * @param dirname 目录
 */
export declare function mkdirsSync(dirname: string): true | undefined;
