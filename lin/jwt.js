"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importStar(require("jsonwebtoken"));
const exception_1 = require("./exception");
const lodash_1 = require("lodash");
const core_1 = require("./core");
const enums_1 = require("./enums");
const config_1 = require("./config");
/**
 * 令牌类，提供令牌的生成和解析功能
 *
 * ```js
 * const jwt = new Token(
 * config.getItem("secret"),
 * config.getItem("accessExp"),
 * config.getItem("refreshExp")
 * );
 * ```
 */
class Token {
    /**
     * 构造函数
     * @param secret 牌的secret值
     * @param accessExp access token 过期时间
     * @param refreshExp refresh token 过期时间
     */
    constructor(secret, accessExp, refreshExp) {
        /**
         * access token 默认的过期时间
         */
        this.accessExp = 60 * 60; // 1h;
        /**
         * refresh token 默认的过期时间
         */
        this.refreshExp = 60 * 60 * 24 * 30 * 3; // 3 months
        secret && (this.secret = secret);
        refreshExp && (this.refreshExp = refreshExp);
        accessExp && (this.accessExp = accessExp);
    }
    /**
     * 挂载到 ctx 上
     */
    initApp(app, secret, accessExp, refreshExp) {
        // 将jwt实例挂到app的context上
        app.context.jwt = this;
        secret && (this.secret = secret);
        refreshExp && (this.refreshExp = refreshExp);
        accessExp && (this.accessExp = accessExp);
    }
    /**
     * 生成access_token
     * @param identity 标识位
     */
    createAccessToken(identity) {
        if (!this.secret) {
            throw new Error('密匙不可为空');
        }
        let exp = Math.floor(Date.now() / 1000) + this.accessExp;
        return jsonwebtoken_1.default.sign({
            exp: exp,
            identity: identity,
            scope: 'lin',
            type: enums_1.TokenType.ACCESS
        }, this.secret);
    }
    /**
     * 生成refresh_token
     * @param identity 标识位
     */
    createRefreshToken(identity) {
        if (!this.secret) {
            throw new Error('密匙不可为空');
        }
        let exp = Math.floor(Date.now() / 1000) + this.refreshExp;
        return jsonwebtoken_1.default.sign({
            exp: exp,
            identity: identity,
            scope: 'lin',
            type: enums_1.TokenType.REFRESH
        }, this.secret);
    }
    /**
     * verifyToken 验证token
     * 若过期，抛出ExpiredTokenException
     * 若失效，抛出InvalidTokenException
     *
     * @param token 令牌
     */
    verifyToken(token) {
        if (!this.secret) {
            throw new Error('密匙不可为空');
        }
        // NotBeforeError
        // TokenExpiredError
        let decode;
        try {
            decode = jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new exception_1.ExpiredTokenException();
            }
            else {
                throw new exception_1.InvalidTokenException();
            }
        }
        return decode;
    }
}
exports.Token = Token;
/**
 * jwt 的实例
 */
const jwt = new Token(config_1.config.getItem('secret'), config_1.config.getItem('accessExp'), config_1.config.getItem('refreshExp'));
exports.jwt = jwt;
/**
 * 生成access token
 * @param payload 负载，支持 string 和 object
 * @param options 参数
 */
function createAccessToken(payload, options) {
    // type: TokenType.REFRESH
    let exp = Math.floor(Date.now() / 1000) + jwt.accessExp;
    if (typeof payload === 'string') {
        return jsonwebtoken_1.default.sign({ indentify: payload, type: enums_1.TokenType.ACCESS, exp: jwt.accessExp }, jwt.secret, options);
    }
    else {
        return jsonwebtoken_1.default.sign(Object.assign({}, payload, { type: enums_1.TokenType.ACCESS, exp: exp }), jwt.secret, options);
    }
}
exports.createAccessToken = createAccessToken;
/**
 * 生成refresh token
 * @param payload 负载，支持 string 和 object
 * @param options 参数
 */
function createRefreshToken(payload, options) {
    let exp = Math.floor(Date.now() / 1000) + jwt.refreshExp;
    // type: TokenType.REFRESH
    if (typeof payload === 'string') {
        return jsonwebtoken_1.default.sign({ indentify: payload, type: enums_1.TokenType.REFRESH, exp: jwt.refreshExp }, jwt.secret, options);
    }
    else {
        return jsonwebtoken_1.default.sign(Object.assign({}, payload, { type: enums_1.TokenType.REFRESH, exp: exp }), jwt.secret, options);
    }
}
exports.createRefreshToken = createRefreshToken;
/**
 * 验证 access token
 * @param token 令牌
 * @param options 选项
 */
function verifyAccessToken(token, options) {
    let decode;
    try {
        decode = jsonwebtoken_1.default.verify(token, jwt.secret, options);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new exception_1.ExpiredTokenException();
        }
        else {
            throw new exception_1.InvalidTokenException();
        }
    }
    if (!decode['type'] || decode['type'] !== enums_1.TokenType.ACCESS) {
        throw new exception_1.InvalidTokenException({ msg: '令牌类型错误' });
    }
    return decode;
}
exports.verifyAccessToken = verifyAccessToken;
/**
 * 验证 refresh token
 * @param token 令牌
 * @param options 选项
 */
function verifyRefreshToken(token, options) {
    let decode;
    try {
        decode = jsonwebtoken_1.default.verify(token, jwt.secret, options);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new exception_1.ExpiredTokenException();
        }
        else {
            throw new exception_1.InvalidTokenException();
        }
    }
    if (!decode['type'] || decode['type'] !== enums_1.TokenType.REFRESH) {
        throw new exception_1.InvalidTokenException({ msg: '令牌类型错误' });
    }
    return decode;
}
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * 颁发令牌
 * @param user 用户
 */
function getTokens(user) {
    const accessToken = jwt.createAccessToken(user.id);
    const refreshToken = jwt.createRefreshToken(user.id);
    return { accessToken, refreshToken };
}
exports.getTokens = getTokens;
/**
 * 解析请求头
 * @param ctx koa 的context
 * @param type 令牌的类型
 */
async function parseHeader(ctx, type = enums_1.TokenType.ACCESS) {
    // 此处借鉴了koa-jwt
    if (!ctx.header || !ctx.header.authorization) {
        ctx.throw(new exception_1.AuthFailed({ msg: '认证失败，请检查请求令牌是否正确' }));
    }
    const parts = ctx.header.authorization.split(' ');
    if (parts.length === 2) {
        // Bearer 字段
        const scheme = parts[0];
        // token 字段
        const token = parts[1];
        if (/^Bearer$/i.test(scheme)) {
            const obj = ctx.jwt.verifyToken(token);
            if (!lodash_1.get(obj, 'type') || lodash_1.get(obj, 'type') !== type) {
                ctx.throw(new exception_1.AuthFailed({ msg: '请使用正确类型的令牌' }));
            }
            if (!lodash_1.get(obj, 'scope') || lodash_1.get(obj, 'scope') !== 'lin') {
                ctx.throw(new exception_1.AuthFailed({ msg: '请使用正确作用域的令牌' }));
            }
            const user = await ctx.manager.userModel.findByPk(lodash_1.get(obj, 'identity'));
            if (!user) {
                ctx.throw(new exception_1.NotFound({ msg: '用户不存在' }));
            }
            // 将user挂在ctx上
            ctx.currentUser = user;
        }
    }
    else {
        ctx.throw(new exception_1.AuthFailed());
    }
}
function checkUserIsActive(user) {
    if (!user || !user.isActive) {
        throw new exception_1.AuthFailed({ msg: '您目前处于未激活状态，请联系超级管理员' });
    }
}
exports.checkUserIsActive = checkUserIsActive;
/**
 * 守卫函数，用户登陆即可访问
 */
async function loginRequired(ctx, next) {
    if (ctx.request.method !== 'OPTIONS') {
        await parseHeader(ctx);
        // 一定要await，否则这个守卫函数没有作用
        // 用户处于未激活状态
        const currentUser = ctx.currentUser;
        checkUserIsActive(currentUser);
        await next();
    }
    else {
        await next();
    }
}
exports.loginRequired = loginRequired;
/**
 * 守卫函数，用户刷新令牌
 */
async function refreshTokenRequired(ctx, next) {
    // 添加access 和 refresh 的标识位
    if (ctx.request.method !== 'OPTIONS') {
        await parseHeader(ctx, enums_1.TokenType.REFRESH);
        await next();
    }
    else {
        await next();
    }
}
exports.refreshTokenRequired = refreshTokenRequired;
/**
 * 守卫函数，用户刷新令牌，统一异常
 */
async function refreshTokenRequiredWithUnifyException(ctx, next) {
    // 添加access 和 refresh 的标识位
    if (ctx.request.method !== 'OPTIONS') {
        try {
            await parseHeader(ctx, enums_1.TokenType.REFRESH);
        }
        catch (error) {
            throw new exception_1.RefreshException();
        }
        await next();
    }
    else {
        await next();
    }
}
exports.refreshTokenRequiredWithUnifyException = refreshTokenRequiredWithUnifyException;
/**
 * 守卫函数，用于权限组鉴权
 */
async function groupRequired(ctx, next) {
    if (ctx.request.method !== 'OPTIONS') {
        await parseHeader(ctx);
        const currentUser = ctx.currentUser;
        // 用户处于未激活状态
        checkUserIsActive(currentUser);
        // 超级管理员
        if (currentUser && currentUser.isAdmin) {
            await next();
        }
        else {
            const groupId = currentUser.group_id;
            if (!groupId) {
                throw new exception_1.AuthFailed({
                    msg: '您还不属于任何权限组，请联系超级管理员获得权限'
                });
            }
            if (ctx.matched) {
                const routeName = ctx._matchedRouteName || ctx.routerName;
                const endpoint = `${ctx.method} ${routeName}`;
                const { auth, module } = core_1.routeMetaInfo.get(endpoint);
                const item = await ctx.manager.authModel.findOne({
                    where: { auth, module }
                });
                // console.log(item);
                if (item) {
                    await next();
                }
                else {
                    throw new exception_1.AuthFailed({ msg: '权限不够，请联系超级管理员获得权限' });
                }
            }
            else {
                throw new exception_1.AuthFailed({ msg: '权限不够，请联系超级管理员获得权限' });
            }
        }
    }
    else {
        await next();
    }
}
exports.groupRequired = groupRequired;
/**
 * 守卫函数，非超级管理员不可访问
 */
async function adminRequired(ctx, next) {
    if (ctx.request.method !== 'OPTIONS') {
        await parseHeader(ctx);
        const currentUser = ctx.currentUser;
        if (currentUser && currentUser.isAdmin) {
            await next();
        }
        else {
            throw new exception_1.AuthFailed({ msg: '只有超级管理员可操作' });
        }
    }
    else {
        await next();
    }
}
exports.adminRequired = adminRequired;
