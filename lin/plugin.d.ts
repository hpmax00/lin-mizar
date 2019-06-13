/**
 * 插件类，一个插件包含自己的业务 (router)，自己的模型 (model)
 * 自己的校验层，视图层
 */
export declare class Plugin {
    /**
     * 插件名称
     */
    name: string;
    /**
     * 模型容器
     */
    models: {};
    /**
     * 控制器容器
     */
    controllers: {};
    constructor(name: string);
    /**
     * 添加一个模型
     * @param name 模型名
     * @param model 模型
     */
    addModel(name: string, model: any): void;
    /**
     * 获得模型
     * @param name 模型名
     */
    getModel(name: string): any;
    /**
     * 添加一个控制器
     * @param name 控制器名
     * @param controller 控制器
     */
    addController(name: string, controller: any): void;
}
