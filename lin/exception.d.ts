/**
 * HttpException 类构造函数的参数接口
 */
export interface Exception {
    code?: number;
    msg?: any;
    errorCode?: number;
}
/**
 * HttpException 是lin中所有其他异常的基类
 *
 * ```js
 * // 实例化一个默认的HttpException
 * const ex = new HttpException();
 *
 * // 实例化一个带参的HttpException
 * const ex = new HttpException({ msg: "想给你一个信息呢！" });
 *
 * // 也可以是其他参数
 * const ex = new HttpException({ errorCode: 10010 });
 *
 * // 也可以指定所有参数
 * const ex = new HttpException({ errorCode: 10010, msg: "想给你一个信息呢！", code: 200 });
 * ```
 */
export declare class HttpException extends Error {
    /**
     * http 状态码
     */
    code: number;
    /**
     * 返回的信息内容
     */
    msg: any;
    /**
     * 特定的错误码
     */
    errorCode: number;
    fields: string[];
    /**
     * 构造函数
     * @param ex 可选参数，通过{}的形式传入
     */
    constructor(ex?: Exception);
}
/**
 * 成功
 */
export declare class Success extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 失败
 */
export declare class Failed extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 认证失败
 */
export declare class AuthFailed extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 资源不存在
 */
export declare class NotFound extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 参数错误
 */
export declare class ParametersException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 令牌失效或损坏
 */
export declare class InvalidTokenException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 令牌过期
 */
export declare class ExpiredTokenException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 服务器未知错误
 */
export declare class UnknownException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 字段重复
 */
export declare class RepeatException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 不可操作
 */
export declare class Forbidden extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 请求方法不允许
 */
export declare class MethodNotAllowed extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * refresh token 获取失败
 */
export declare class RefreshException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 文件体积过大
 */
export declare class FileTooLargeException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 文件数量过多
 */
export declare class FileTooManyException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 文件扩展名不符合规范
 */
export declare class FileExtensionException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
/**
 * 请求过于频繁，请稍后重试
 */
export declare class LimitException extends HttpException {
    code: number;
    msg: string;
    errorCode: number;
    constructor(ex?: Exception);
}
