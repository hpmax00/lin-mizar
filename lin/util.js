"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const core_1 = require("./core");
const lodash_1 = require("lodash");
const config_1 = require("./config");
const exception_1 = require("./exception");
const extended_validator_1 = require("./extended-validator");
const tslib_2 = require("tslib");
exports.isUndefined = (obj) => typeof obj === 'undefined';
exports.isFunction = (fn) => typeof fn === 'function';
exports.isObject = (fn) => !exports.isNil(fn) && typeof fn === 'object';
exports.isString = (fn) => typeof fn === 'string';
exports.isConstructor = (fn) => fn === 'constructor';
exports.validatePath = (path) => path ? (path.charAt(0) !== '/' ? '/' + path : path) : '';
// tslint:disable-next-line: strict-type-predicates
exports.isNil = (obj) => exports.isUndefined(obj) || obj === null;
exports.isEmpty = (array) => !(array && array.length > 0);
exports.isSymbol = (fn) => typeof fn === 'symbol';
exports.strVal = (value) => typeof value === 'string' ? value : String(value);
exports.isNotEmpty = extended_validator_1.extendedValidator.isNotEmpty;
exports.isNegative = extended_validator_1.extendedValidator.isNegative;
exports.isPositive = extended_validator_1.extendedValidator.isPositive;
/**
 * Assertion utility.
 */
function assert(ok, ...args) {
    if (!ok) {
        throw new Error(args.join(' '));
    }
}
exports.assert = assert;
// 下划线转换驼峰
function toHump(name) {
    return name.replace(/\_(\w)/g, (_, letter) => {
        return letter.toUpperCase();
    });
}
exports.toHump = toHump;
// 驼峰转换下划线
function toLine(name) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}
exports.toLine = toLine;
/**
 * 通过当前的路由名找到对应的权限录入信息
 * @param ctx koa 的 context
 */
function findAuthAndModule(ctx) {
    const routeName = ctx._matchedRouteName || ctx.routerName;
    const endpoint = `${ctx.method} ${routeName}`;
    return core_1.routeMetaInfo.get(endpoint);
}
exports.findAuthAndModule = findAuthAndModule;
function findMetaByAuth(auth) {
    const dests = Array.from(core_1.routeMetaInfo.values());
    for (let i = 0; i < dests.length; i++) {
        const el = dests[i];
        if (el['auth'] === auth) {
            return el;
        }
    }
    return null;
}
exports.findMetaByAuth = findMetaByAuth;
/**
 * 检查日期的格式为 "YYYY-MM-DD HH:mm:ss"
 * @param time input time
 */
function checkDateFormat(time) {
    if (!time || time === '') {
        return true;
    }
    const r = time.match(/^(\d{4})(-|\/)(\d{2})\2(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (r === null)
        return false;
    const d = new Date(parseInt(r[1], 10), parseInt(r[3], 10) - 1, parseInt(r[4], 10), parseInt(r[5], 10), parseInt(r[6], 10), parseInt(r[7], 10));
    return (d.getFullYear() === parseInt(r[1], 10) &&
        d.getMonth() + 1 === parseInt(r[3], 10) &&
        d.getDate() === parseInt(r[4], 10) &&
        d.getHours() === parseInt(r[5], 10) &&
        d.getMinutes() === parseInt(r[6], 10) &&
        d.getSeconds() === parseInt(r[7], 10));
}
exports.checkDateFormat = checkDateFormat;
function paginate(ctx) {
    let count = lodash_1.get(ctx.request.query, 'count') || config_1.config.getItem('countDefault', 10);
    let start = lodash_1.get(ctx.request.query, 'page') || config_1.config.getItem('pageDefault', 0);
    count = parseInt(count >= 15 ? 15 : count, 10);
    start = parseInt(start, 10) * count;
    if (start < 0 || count < 0) {
        throw new exception_1.ParametersException({ msg: '请输入正确的分页参数' });
    }
    return { start, count };
}
exports.paginate = paginate;
function unsets(obj, props) {
    props.forEach(prop => {
        lodash_1.unset(obj, prop);
    });
}
exports.unsets = unsets;
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
function decorateProp(decorators, type, target, key) {
    return tslib_2.__decorate([...decorators, tslib_2.__metadata('design:type', type)], target, key);
}
exports.decorateProp = decorateProp;
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
function getAllMethodNames(obj, option) {
    let methods = new Set();
    // tslint:disable-next-line:no-conditional-assignment
    while ((obj = Reflect.getPrototypeOf(obj))) {
        let keys = Reflect.ownKeys(obj);
        keys.forEach(k => methods.add(k));
    }
    let keys = Array.from(methods.values());
    return prefixAndFilter(keys, option);
}
exports.getAllMethodNames = getAllMethodNames;
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
function getAllFieldNames(obj, option) {
    let keys = Reflect.ownKeys(obj);
    return prefixAndFilter(keys, option);
}
exports.getAllFieldNames = getAllFieldNames;
function prefixAndFilter(keys, option) {
    option &&
        option.prefix &&
        (keys = keys.filter(key => key.toString().startsWith(option.prefix)));
    option && option.filter && (keys = keys.filter(option.filter));
    return keys;
}
/**
 * 获取文件夹下所有文件名
 * @param dir 文件夹
 */
function getFiles(dir) {
    let res = [];
    const files = fs_1.default.readdirSync(dir);
    for (const file of files) {
        const name = dir + '/' + file;
        if (fs_1.default.statSync(name).isDirectory()) {
            const tmp = getFiles(name);
            res = res.concat(tmp);
        }
        else {
            res.push(name);
        }
    }
    return res;
}
exports.getFiles = getFiles;
/**
 * 递归创建目录 同步方法
 * @param dirname 目录
 */
function mkdirsSync(dirname) {
    if (fs_1.default.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdirsSync(path_1.default.dirname(dirname))) {
            fs_1.default.mkdirSync(dirname);
            return true;
        }
    }
}
exports.mkdirsSync = mkdirsSync;
