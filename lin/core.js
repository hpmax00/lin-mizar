"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const consola_1 = tslib_1.__importDefault(require("consola"));
const sequelize_1 = require("sequelize");
const jwt_1 = require("./jwt");
const util_1 = require("./util");
const db_1 = require("./db");
const interface_1 = require("./interface");
const extend_1 = require("./extend");
const exception_1 = require("./exception");
const lodash_1 = require("lodash");
const loader_1 = require("./loader");
const lin_router_1 = require("./lin-router");
const password_hash_1 = require("./password-hash");
const config_1 = require("./config");
// tslint:disable-next-line:variable-name
exports.__version__ = '0.0.1';
// 存放meta路由信息
exports.routeMetaInfo = new Map();
// 当前文件路由是否挂载
exports.disableLoading = Symbol('disableLoading');
/**
 * Lin核心类
 */
class Lin {
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
    async initApp(app, mount, // 是否挂载插件路由，默认为true
    synchronize, // 是否同步模型到数据库
    userModel, groupModel, authModel) {
        this.app = app;
        util_1.assert(!!this.app, 'app must not be null');
        // 2. 默认扩展 json logger
        this.applyDefaultExtends();
        // 3. manager
        userModel = userModel || User;
        groupModel = groupModel || Group;
        authModel = authModel || Auth;
        this.applyManager(userModel, groupModel, authModel);
        // 4. db 同步到数据库默认为false，每次同步会很慢 todo 抽离
        await this.applyDB(synchronize);
        // 5. jwt
        this.applyJwt();
        // 6. 挂载默认路由
        mount && this.mount();
    }
    applyJwt() {
        const secret = this.app.context.config.getItem('secret');
        jwt_1.jwt.initApp(this.app, secret);
    }
    async applyDB(synchronize, force) {
        synchronize && db_1.db.sync({ force });
    }
    applyManager(userModel, groupModel, authModel) {
        const manager = new Manager();
        this.manager = manager;
        const pluginPath = this.app.context.config.getItem('pluginPath');
        manager.initApp(this.app, userModel, groupModel, authModel, pluginPath);
    }
    applyDefaultExtends() {
        extend_1.json(this.app);
        extend_1.logging(this.app);
        extend_1.success(this.app);
    }
    mount() {
        const pluginRp = new lin_router_1.LinRouter({ prefix: '/plugin' });
        Object.values(this.manager.plugins).forEach(plugin => {
            consola_1.default.info(`loading plugin: ${lodash_1.get(plugin, 'name')}`);
            const controllers = Object.values(lodash_1.get(plugin, 'controllers'));
            if (controllers.length > 1) {
                controllers.forEach((cont) => {
                    lodash_1.set(cont, 'opts.prefix', `/${lodash_1.get(plugin, 'name')}${lodash_1.get(cont, 'opts.prefix')}`);
                    lodash_1.get(cont, 'stack', []).forEach(ly => {
                        if (config_1.config.getItem('debug')) {
                            consola_1.default.info(`loading a route: /plugin/${lodash_1.get(plugin, 'name')}${lodash_1.get(ly, 'path')}`);
                        }
                        lodash_1.set(ly, 'path', `/${lodash_1.get(plugin, 'name')}${lodash_1.get(ly, 'path')}`);
                    });
                    pluginRp
                        .use(cont.routes())
                        .use(cont.allowedMethods());
                });
            }
            else {
                controllers.forEach(cont => {
                    if (config_1.config.getItem('debug')) {
                        lodash_1.get(cont, 'stack', []).forEach(ly => {
                            consola_1.default.info(`loading a route: /plugin${lodash_1.get(ly, 'path')}`);
                        });
                    }
                    pluginRp
                        .use(cont.routes())
                        .use(cont.allowedMethods());
                });
            }
        });
        this.app.use(pluginRp.routes()).use(pluginRp.allowedMethods());
    }
}
exports.Lin = Lin;
/**
 * 管理者
 * 管理插件，数据模型
 */
class Manager {
    /**
     * 初始化
     * @param app koa app
     * @param userModel 用户模型
     * @param groupModel 分组模型
     * @param authModel 权限模型
     * @param pluginPath 插件路径
     */
    initApp(app, userModel, groupModel, authModel, pluginPath) {
        app.context.manager = this;
        this.userModel = userModel;
        this.groupModel = groupModel;
        this.authModel = authModel;
        this.loader = new loader_1.Loader(pluginPath, app);
    }
    /**
     * 获取插件
     */
    get plugins() {
        return this.loader.plugins;
    }
    /**
     * 校验密码是否正确
     * @param nickname 昵称
     * @param password 密码
     */
    verify(nickname, password) {
        return this.userModel.verify(nickname, password);
    }
    /**
     * 寻找用户
     * @param args 参数
     */
    findUser(args) {
        return this.userModel.findOne({ where: Object.assign({}, args) });
    }
    /**
     * 寻找分组
     * @param args 参数
     */
    findGroup(args) {
        return this.groupModel.findOne({ where: Object.assign({}, args) });
    }
}
exports.Manager = Manager;
/**
 * 权限系统中的User模型
 */
class User extends sequelize_1.Model {
    static async verify(nickname, password) {
        // tslint:disable-next-line: await-promise
        const user = await this.findOne({ where: { nickname, delete_time: null } });
        if (!user) {
            throw new exception_1.NotFound({ msg: '用户不存在' });
        }
        if (!user.checkPassword(password)) {
            throw new exception_1.ParametersException({ msg: '密码错误，请输入正确密码' });
        }
        return user;
    }
    checkPassword(raw) {
        if (!this.password || this.password === '') {
            return false;
        }
        return password_hash_1.verify(raw, this.password);
    }
    resetPassword(newPassword) {
        this.password = newPassword;
    }
    changePassword(oldPassword, newPassword) {
        if (this.checkPassword(oldPassword)) {
            this.password = newPassword;
            return true;
        }
        return false;
    }
    toJSON() {
        const origin = {
            id: this.id,
            nickname: this.nickname,
            admin: this.admin,
            active: this.active,
            email: this.email,
            avatar: this.avatar,
            group_id: this.group_id,
            // @ts-ignore
            create_time: this.createTime,
            // @ts-ignore
            update_time: this.updateTime
        };
        if (lodash_1.has(this, 'auths')) {
            return Object.assign({}, origin, { auths: lodash_1.get(this, 'auths', []) });
        }
        else if (lodash_1.has(this, 'groupName')) {
            return Object.assign({}, origin, { group_name: lodash_1.get(this, 'groupName', '') });
        }
        else {
            return origin;
        }
    }
}
exports.User = User;
User.init(Object.assign({}, interface_1.UserInterface.attributes), lodash_1.merge({
    sequelize: db_1.db,
    tableName: 'lin_user',
    modelName: 'user'
}, interface_1.UserInterface.options));
/**
 * 权限系统中的Group模型
 */
class Group extends sequelize_1.Model {
    toJSON() {
        let origin = {
            id: this.id,
            name: this.name,
            info: this.info
        };
        return lodash_1.has(this, 'auths')
            ? Object.assign({}, origin, { auths: lodash_1.get(this, 'auths', []) }) : origin;
    }
}
exports.Group = Group;
Group.init(Object.assign({}, interface_1.GroupInterface.attributes), lodash_1.merge({
    sequelize: db_1.db,
    tableName: 'lin_group',
    modelName: 'group'
}, interface_1.GroupInterface.options));
/**
 * 权限系统中的Auth模型
 */
class Auth extends sequelize_1.Model {
    toJSON() {
        return {
            id: this.id,
            group_id: this.group_id,
            module: this.module,
            auth: this.auth
        };
    }
}
exports.Auth = Auth;
Auth.init(Object.assign({}, interface_1.AuthInterface.attributes), lodash_1.merge({
    sequelize: db_1.db,
    tableName: 'lin_auth',
    modelName: 'auth'
}, interface_1.AuthInterface.options));
/**
 * 日志模型
 */
class Log extends sequelize_1.Model {
    static createLog(args, commit) {
        const log = Log.build(args);
        commit && log.save();
        return log;
    }
    toJSON() {
        let origin = {
            id: this.id,
            message: this.message,
            time: this.time,
            user_id: this.user_id,
            user_name: this.user_name,
            status_code: this.status_code,
            method: this.method,
            path: this.path,
            authority: this.authority
        };
        return origin;
    }
}
exports.Log = Log;
Log.init(Object.assign({}, interface_1.LogInterface.attributes), lodash_1.merge({
    sequelize: db_1.db,
    tableName: 'lin_log',
    modelName: 'log'
}, interface_1.LogInterface.options));
/**
 * 文件模型
 * id,path,type,name,extension,size
 */
class File extends sequelize_1.Model {
    static async createRecord(args, commit) {
        const record = File.build(args);
        // tslint:disable-next-line: await-promise
        commit && (await record.save());
        return record;
    }
    toJSON() {
        let origin = {
            id: this.id,
            path: this.path,
            type: this.type,
            name: this.name,
            extension: this.extension,
            size: this.size,
            md5: this.md5
        };
        return origin;
    }
}
exports.File = File;
File.init(Object.assign({}, interface_1.FileInterface), {
    sequelize: db_1.db,
    tableName: 'lin_file',
    modelName: 'file',
    createdAt: false,
    updatedAt: false,
    deletedAt: false
});
