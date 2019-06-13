import { Validator as BaseValidator } from 'class-validator';
/**
 * IsFloat的参数可选项
 */
interface IsFloatOptions {
    min?: number;
    max?: number;
    gt?: number;
    lt?: number;
}
/**
 * IsInt的参数可选项
 */
interface IsIntOptions {
    min?: number;
    max?: number;
    allow_leading_zeroes?: boolean;
    lt?: number;
    gt?: number;
}
/**
 * Validator扩展类
 */
export declare class ExtendedValidator extends BaseValidator {
    /**
     * 检查一个object是否具有某个属性
     * @param obj
     * @param path
     *
     * ```js
     * hasProperty({a:"l"},"a")
     * ```
     */
    hasProperty(obj: any, path: string): boolean;
    /**
     * 检查一个object的某个属性是否为空
     * @param obj
     * @param path
     *
     * ```js
     * objPropertyIsNotEmpty({ a : { b: "c" }, "a.b" })
     * ```
     */
    objPropertyIsNotEmpty(obj: any, path: string): boolean;
    /**
     * 检查一个object的多个属性是否为空
     * @param obj
     * @param paths
     *
     * ```js
     * objPropertiesIsNotEmpty({a: {b:"c", d: "e"}}, ["a.b","a.d"])
     * ```
     */
    objPropertiesIsNotEmpty(obj: any, paths: string[]): boolean;
    /**
     * 字符串转int
     * @param input 输入字符串
     * @param radix 精度
     */
    toInt(input: string, radix?: number): number;
    /**
     * 字符串转float
     * @param input 输入字符串
     */
    toFloat(input: string): number;
    /**
     * 字符串转boolean
     * @param input 输入字符串
     */
    toBoolean(input: string): boolean;
    /**
     * 字符串转Date
     * @param input 输入字符串
     */
    toDate(input: string): Date;
    /**
     * 检查字符串是否为float
     * @param str 输入字符串
     * @param options 参数项
     */
    isFloat(str: string, options?: IsFloatOptions): boolean;
    /**
     * 检查number是否为float
     * @param input 输入number
     * @param options 参数项
     */
    isFloat2(input: number, options?: IsFloatOptions): boolean;
    /**
     * 检查字符串是否为int
     * @param str 输入字符串
     * @param options 参数项
     */
    isInt2(str: string, options?: IsIntOptions): boolean;
    /**
     * 检查number是否为int
     * @param str 输入number
     * @param options 参数项
     */
    isInt3(input: number, options?: IsIntOptions): boolean;
}
/**
 * 全局的校验器
 */
export declare const extendedValidator: ExtendedValidator;
export {};
