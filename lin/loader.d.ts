/// <reference types="koa-bodyparser" />
import Application from 'koa';
import Router from 'koa-router';
/**
 * 加载器
 * 用于加载插件和路由文件
 */
export declare class Loader {
    mainRouter: Router | undefined;
    pluginPath: {};
    private app;
    plugins: {};
    constructor(pluginPath: {}, app: Application);
    /**
     * 加载插件
     */
    loadPlugins(): void;
    /**
     * loadPlugin 加载单个插件
     */
    loadPlugin(name: string, path: string): void;
    /**
     * loadConfig 加载插件配置
     */
    loadConfig(name: string, path: string, incomingConf: {}): void;
    /**
     * 加载主应用中的所有路由
     */
    loadMainApi(app: Application): void;
}
