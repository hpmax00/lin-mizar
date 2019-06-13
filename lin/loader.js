"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("./util");
const lodash_1 = require("lodash");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const consola_1 = tslib_1.__importDefault(require("consola"));
const path_1 = tslib_1.__importDefault(require("path"));
const sequelize_1 = require("sequelize");
const plugin_1 = require("./plugin");
const config_1 = require("./config");
const core_1 = require("./core");
/**
 * 加载器
 * 用于加载插件和路由文件
 */
class Loader {
    constructor(pluginPath, app) {
        this.plugins = {};
        util_1.assert(!!pluginPath, 'pluginPath must not be empty');
        this.pluginPath = pluginPath;
        this.app = app;
        this.loadMainApi(app);
        this.loadPlugins();
    }
    /**
     * 加载插件
     */
    loadPlugins() {
        Object.keys(this.pluginPath).forEach(item => {
            // item is name of plugin
            if (lodash_1.get(this.pluginPath, `${item}.enable`)) {
                const path1 = lodash_1.get(this.pluginPath, `${item}.path`);
                const baseDir = process.cwd();
                let confPath = '';
                const scriptType = config_1.config.getItem('scriptType', 'js');
                const prod = process.env.NODE_ENV === 'production';
                if (prod || scriptType !== 'ts') {
                    confPath = path_1.default.resolve(baseDir, path1, 'config.js');
                }
                else {
                    confPath = path_1.default.resolve(baseDir, path1, 'config.ts');
                }
                const appPath = path_1.default.resolve(baseDir, path1, 'app');
                const incomingConf = lodash_1.get(this.pluginPath, item);
                this.loadConfig(item, confPath, incomingConf);
                this.loadPlugin(item, appPath);
            }
        });
    }
    /**
     * loadPlugin 加载单个插件
     */
    loadPlugin(name, path) {
        const mod = require(path);
        // const exports = get(mod, "default");
        const plugin = new plugin_1.Plugin(name);
        Object.keys(mod).forEach(key => {
            if (mod[key] instanceof koa_router_1.default) {
                plugin.addController(key, mod[key]);
            }
            else if (sequelize_1.Model.isPrototypeOf(mod[key])) {
                // 如果导出的模型继承自Model
                plugin.addModel(key, mod[key]);
            }
        });
        this.plugins[name] = plugin;
    }
    /**
     * loadConfig 加载插件配置
     */
    loadConfig(name, path, incomingConf) {
        const mod = require(path);
        // const conf = get(mod, "default");
        const newConf = {};
        lodash_1.set(newConf, name, Object.assign({}, mod, incomingConf));
        this.app.context.config.getConfigFromObj(newConf);
    }
    /**
     * 加载主应用中的所有路由
     */
    loadMainApi(app) {
        const mainRouter = new koa_router_1.default();
        this.mainRouter = mainRouter;
        // 默认api的文件夹
        let apiDir = config_1.config.getItem('apiDir', 'app/api');
        apiDir = `${process.cwd()}/${apiDir}`;
        const files = util_1.getFiles(apiDir);
        for (const file of files) {
            const extention = file.substring(file.lastIndexOf('.'), file.length);
            // 现在只考虑加载.js文件，后续考虑.ts文件
            if (extention === '.js') {
                const mod = require(file);
                // 如果mod 为 koa-router实例
                // const exports = get(mod, "default");
                // 如果disableLoading为true，则不加载这个文件路由
                // tslint:disable-next-line:no-empty
                if (mod instanceof koa_router_1.default) {
                    if (config_1.config.getItem('debug')) {
                        consola_1.default.info(`loading a router instance from file: ${file}`);
                        lodash_1.get(mod, 'stack', []).forEach(ly => {
                            consola_1.default.info(`loading a route: ${lodash_1.get(ly, 'path')}`);
                        });
                    }
                    mainRouter.use(mod.routes()).use(mod.allowedMethods());
                }
                else if (!mod[core_1.disableLoading]) {
                    Object.keys(mod).forEach(key => {
                        if (mod[key] instanceof koa_router_1.default) {
                            if (config_1.config.getItem('debug')) {
                                consola_1.default.info(`loading a router instance :${key} from file: ${file}`);
                                lodash_1.get(mod[key], 'stack', []).forEach(ly => {
                                    consola_1.default.info(`loading a route: ${lodash_1.get(ly, 'path')}`);
                                });
                            }
                            mainRouter.use(mod[key].routes()).use(mod[key].allowedMethods());
                        }
                    });
                }
            }
        }
        app.use(mainRouter.routes()).use(mainRouter.allowedMethods());
    }
}
exports.Loader = Loader;
