/// <reference types="koa-bodyparser" />
import Application from 'koa';
import { Model } from 'sequelize';
import { Loader } from './loader';
export declare const __version__ = "0.0.1";
export declare const routeMetaInfo: Map<any, any>;
export declare const disableLoading: unique symbol;
/**
 * Lin核心类
 */
export declare class Lin {
    private manager;
    private app;
    /**
     * 初始化
     *
     * @param app koa app
     * @param mount 是否挂载路由
     * @param synchronize 是否同步模型到数据库
     * @param userModel 用户模型
     * @param groupModel 分组模型
     * @param authModel 权限模型
     */
    initApp(app: Application, mount?: boolean, // 是否挂载插件路由，默认为true
    synchronize?: boolean, // 是否同步模型到数据库
    userModel?: any, groupModel?: any, authModel?: any): Promise<void>;
    private applyJwt;
    private applyDB;
    private applyManager;
    private applyDefaultExtends;
    private mount;
}
/**
 * 管理者
 * 管理插件，数据模型
 */
export declare class Manager {
    loader: Loader | undefined;
    userModel: any;
    groupModel: any;
    authModel: any;
    /**
     * 初始化
     * @param app koa app
     * @param userModel 用户模型
     * @param groupModel 分组模型
     * @param authModel 权限模型
     * @param pluginPath 插件路径
     */
    initApp(app: Application, userModel: any, groupModel: any, authModel: any, pluginPath: {}): void;
    /**
     * 获取插件
     */
    readonly plugins: {};
    /**
     * 校验密码是否正确
     * @param nickname 昵称
     * @param password 密码
     */
    verify(nickname: string, password: string): any;
    /**
     * 寻找用户
     * @param args 参数
     */
    findUser(args: {}): any;
    /**
     * 寻找分组
     * @param args 参数
     */
    findGroup(args: {}): any;
}
/**
 * 权限系统中的User模型
 */
export declare class User extends Model {
    id: number;
    nickname: string;
    admin: number;
    active: number;
    email: string;
    avatar: string;
    group_id: number;
    password: string;
    create_time: Date;
    update_time: Date;
    delete_time: Date;
    static verify(nickname: string, password: string): Promise<User>;
    checkPassword(raw: string): boolean;
    resetPassword(newPassword: string): void;
    changePassword(oldPassword: string, newPassword: string): boolean;
    toJSON(): {
        id: number;
        nickname: string;
        admin: number;
        active: number;
        email: string;
        avatar: string;
        group_id: number;
        create_time: any;
        update_time: any;
    } | {
        auths: any;
        id: number;
        nickname: string;
        admin: number;
        active: number;
        email: string;
        avatar: string;
        group_id: number;
        create_time: any;
        update_time: any;
    } | {
        group_name: any;
        id: number;
        nickname: string;
        admin: number;
        active: number;
        email: string;
        avatar: string;
        group_id: number;
        create_time: any;
        update_time: any;
    };
}
/**
 * 权限系统中的Group模型
 */
export declare class Group extends Model {
    id: number;
    name: string;
    info: string;
    toJSON(): {
        id: number;
        name: string;
        info: string;
    } | {
        auths: any;
        id: number;
        name: string;
        info: string;
    };
}
/**
 * 权限系统中的Auth模型
 */
export declare class Auth extends Model {
    id: number;
    group_id: number;
    auth: string;
    module: string;
    toJSON(): {
        id: number;
        group_id: number;
        module: string;
        auth: string;
    };
}
export interface LogArgs {
    message?: string;
    user_id?: number;
    user_name?: string;
    status_code?: number;
    method?: string;
    path?: string;
    authority?: string;
}
/**
 * 日志模型
 */
export declare class Log extends Model {
    id: number;
    message: string;
    user_id: number;
    user_name: string;
    status_code: number;
    method: string;
    path: string;
    authority: string;
    time: Date;
    static createLog(args?: LogArgs, commit?: boolean): Log;
    toJSON(): {
        id: number;
        message: string;
        time: Date;
        user_id: number;
        user_name: string;
        status_code: number;
        method: string;
        path: string;
        authority: string;
    };
}
export interface FileArgs {
    path?: string;
    type?: number;
    name?: string;
    extension?: string;
    size?: number;
    md5?: string;
}
/**
 * 文件模型
 * id,path,type,name,extension,size
 */
export declare class File extends Model {
    id: number;
    path: string;
    type: number;
    name: string;
    extension: string;
    size: number;
    md5: string;
    static createRecord(args?: FileArgs, commit?: boolean): Promise<File>;
    toJSON(): {
        id: number;
        path: string;
        type: number;
        name: string;
        extension: string;
        size: number;
        md5: string;
    };
}
