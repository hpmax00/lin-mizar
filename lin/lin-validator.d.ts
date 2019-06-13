import { Context } from 'koa';
/**
 * 强大的校验器
 * 支持optional，支持array，支持nested object
 */
export declare class LinValidator {
    /**
     * 装载数据的容器
     */
    data: any;
    /**
     * 解析后的数据容器
     */
    parsed: any;
    /**
     * 数据校验错误容器
     */
    errors: any[];
    /**
     * 别名
     */
    alias: any;
    /**
     * 校验
     * @param ctx koa context
     * @param alias 别名
     */
    validate(ctx: Context, alias?: {}): Promise<this>;
    private replace;
    private isOptional;
    private checkRules;
    /**
     * 获得规则函数的key
     * @param validateFuncKey 规则函数的名称
     */
    private getValidateFuncKey;
    /**
     *  取参数里的值；如果参数不能被解析，则返回没有被解析的值
     * @param path 参数所在的路径，如 a.b
     * @param parsed 是否取已经解析后的数据，默认为true
     * @param defaultVal 默认值，当路径指向的值不存在，取默认值
     */
    get(path: string, parsed?: boolean): any;
    private findInData;
}
/**
 * 规则类
 */
export declare class Rule {
    options: any;
    message: string;
    validateFunction: string | Function;
    optional: boolean;
    parsedValue: any;
    rawValue: any;
    defaultValue: any;
    constructor(validateFunction: string | Function, message?: string, ...options: any[]);
    validate(value: any): any;
}
