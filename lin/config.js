"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const lodash_1 = require("lodash");
/**
 * Config类的实现
 * 帮助应用从文件中读取配置，目前仅支持从js文件中读取配置
 *
 * ```js
 * const config = new Config();
 * config.getConfigFromFile("path/file");
 * ```
 *
 * 当然也支持从object对象中获取配置
 * ```js
 * config.getConfigFromObj({...});
 * ```
 *
 * 获取配置项
 * ```js
 * config.getItem("key");
 * ```
 */
class Config {
    constructor() {
        /**
         * 存储配置的容器
         */
        this.store = {};
    }
    /**
     * 将当前的config实例挂载到koa app的context上
     *
     * @param app koa app实例
     */
    initApp(app) {
        app.context.config = this;
    }
    /**
     * 获取单个的配置项
     * ```js
     * const val = config.getItem("key");
     * ```
     *
     * 支持传入默认值，如果不存在该配置项，则返回传入的默认值
     *
     * ```js
     * const val = config.getItem("key","default");
     * // 如果config中存在key的配置项，则返回其配置项
     * // 否则返回 "default"
     * ```
     *
     * @param key 配置项的路径
     * @param defaultVal 可选参数，默认值
     */
    getItem(key, defaultVal) {
        return lodash_1.get(this.store, key, defaultVal);
    }
    /**
     * 检查是否存在某个配置项
     *
     * ```js
     * const exit = config.hasItem("key");
     * // 如果存在 exit 为true
     * // 不存在，则exit 为false
     * ```
     * @param key 配置项的路径
     */
    hasItem(key) {
        return lodash_1.has(this.store, key);
    }
    /**
     * 通过硬编码的方式设置配置项
     *
     * ```js
     * config.setItem("name","pedro");
     * // 设置 name 配置项的值为 pedro
     * // 如果config中已存在这个配置项，则覆盖原有的
     * ```
     * @param key 配置项的键
     * @param val 配置项的值
     */
    setItem(key, val) {
        lodash_1.set(this.store, key, val);
    }
    /**
     * 从js文件中导入配置
     *
     * ```js
     * config.getConfigFromFile("path/file");
     * ```
     * @param filepath js文件的路径，相对当前工作目录的路径
     */
    getConfigFromFile(filepath) {
        const baseDir = process.cwd();
        const mod = require(path.resolve(baseDir, filepath));
        // const conf = get(mod, "default");
        this.store = lodash_1.merge(this.store, mod);
    }
    /**
     * 从object对象中导入配置
     *
     * ```js
     * config.getConfigFromObj({...});
     * ```
     * @param obj 配置对象 ，如 {}
     */
    getConfigFromObj(obj) {
        this.store = lodash_1.merge(this.store, obj);
    }
}
exports.Config = Config;
/**
 * 全局的config实例
 */
exports.config = new Config();
