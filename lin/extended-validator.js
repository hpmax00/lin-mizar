"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const validator_1 = tslib_1.__importDefault(require("validator"));
/**
 * Validator扩展类
 */
class ExtendedValidator extends class_validator_1.Validator {
    /**
     * 检查一个object是否具有某个属性
     * @param obj
     * @param path
     *
     * ```js
     * hasProperty({a:"l"},"a")
     * ```
     */
    hasProperty(obj, path) {
        return lodash_1.has(obj, path);
    }
    /**
     * 检查一个object的某个属性是否为空
     * @param obj
     * @param path
     *
     * ```js
     * objPropertyIsNotEmpty({ a : { b: "c" }, "a.b" })
     * ```
     */
    objPropertyIsNotEmpty(obj, path) {
        if (!this.hasProperty(obj, path)) {
            return false;
        }
        return this.isNotEmpty(lodash_1.get(obj, path));
    }
    /**
     * 检查一个object的多个属性是否为空
     * @param obj
     * @param paths
     *
     * ```js
     * objPropertiesIsNotEmpty({a: {b:"c", d: "e"}}, ["a.b","a.d"])
     * ```
     */
    objPropertiesIsNotEmpty(obj, paths) {
        for (const path of paths) {
            if (!this.hasProperty(obj, path)) {
                return false;
            }
            if (!this.isNotEmpty(lodash_1.get(obj, path))) {
                return false;
            }
        }
        return true;
    }
    /**
     * 字符串转int
     * @param input 输入字符串
     * @param radix 精度
     */
    toInt(input, radix) {
        return validator_1.default.toInt(input, radix);
    }
    /**
     * 字符串转float
     * @param input 输入字符串
     */
    toFloat(input) {
        return validator_1.default.toFloat(input);
    }
    /**
     * 字符串转boolean
     * @param input 输入字符串
     */
    toBoolean(input) {
        return validator_1.default.toBoolean(input);
    }
    /**
     * 字符串转Date
     * @param input 输入字符串
     */
    toDate(input) {
        return validator_1.default.toDate(input);
    }
    /**
     * 检查字符串是否为float
     * @param str 输入字符串
     * @param options 参数项
     */
    isFloat(str, options) {
        return validator_1.default.isFloat(str, options);
    }
    /**
     * 检查number是否为float
     * @param input 输入number
     * @param options 参数项
     */
    isFloat2(input, options) {
        return validator_1.default.isFloat(input + '', options);
    }
    /**
     * 检查字符串是否为int
     * @param str 输入字符串
     * @param options 参数项
     */
    isInt2(str, options) {
        return validator_1.default.isInt(str, options);
    }
    /**
     * 检查number是否为int
     * @param str 输入number
     * @param options 参数项
     */
    isInt3(input, options) {
        return validator_1.default.isInt(input + '', options);
    }
}
exports.ExtendedValidator = ExtendedValidator;
/**
 * 全局的校验器
 */
exports.extendedValidator = new ExtendedValidator();
