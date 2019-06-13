"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * 插件类，一个插件包含自己的业务 (router)，自己的模型 (model)
 * 自己的校验层，视图层
 */
class Plugin {
    constructor(name) {
        /**
         * 模型容器
         */
        this.models = {};
        /**
         * 控制器容器
         */
        this.controllers = {};
        this.name = name;
    }
    /**
     * 添加一个模型
     * @param name 模型名
     * @param model 模型
     */
    addModel(name, model) {
        lodash_1.set(this.models, name, model);
    }
    /**
     * 获得模型
     * @param name 模型名
     */
    getModel(name) {
        return lodash_1.get(this.models, name);
    }
    /**
     * 添加一个控制器
     * @param name 控制器名
     * @param controller 控制器
     */
    addController(name, controller) {
        lodash_1.set(this.controllers, name, controller);
    }
}
exports.Plugin = Plugin;
