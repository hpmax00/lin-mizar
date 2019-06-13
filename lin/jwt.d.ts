/// <reference types="koa-bodyparser" />
import { VerifyOptions, SignOptions } from 'jsonwebtoken';
import Application from 'koa';
import { RouterContext } from 'koa-router';
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
export declare class Token {
    /**
     * 令牌的secret值，用于令牌的加密
     */
    secret: string | undefined;
    /**
     * access token 默认的过期时间
     */
    accessExp: number;
    /**
     * refresh token 默认的过期时间
     */
    refreshExp: number;
    /**
     * 构造函数
     * @param secret 牌的secret值
     * @param accessExp access token 过期时间
     * @param refreshExp refresh token 过期时间
     */
    constructor(secret?: string, accessExp?: number, refreshExp?: number);
    /**
     * 挂载到 ctx 上
     */
    initApp(app: Application, secret?: string, accessExp?: number, refreshExp?: number): void;
    /**
     * 生成access_token
     * @param identity 标识位
     */
    createAccessToken(identity: string | number): string;
    /**
     * 生成refresh_token
     * @param identity 标识位
     */
    createRefreshToken(identity: string | number): string;
    /**
     * verifyToken 验证token
     * 若过期，抛出ExpiredTokenException
     * 若失效，抛出InvalidTokenException
     *
     * @param token 令牌
     */
    verifyToken(token: string): any;
}
/**
 * jwt 的实例
 */
declare const jwt: Token;
/**
 * 生成access token
 * @param payload 负载，支持 string 和 object
 * @param options 参数
 */
export declare function createAccessToken(payload: string | object, options?: SignOptions): string;
/**
 * 生成refresh token
 * @param payload 负载，支持 string 和 object
 * @param options 参数
 */
export declare function createRefreshToken(payload: string | object, options?: SignOptions): string;
/**
 * 验证 access token
 * @param token 令牌
 * @param options 选项
 */
export declare function verifyAccessToken(token: string, options?: VerifyOptions): any;
/**
 * 验证 refresh token
 * @param token 令牌
 * @param options 选项
 */
export declare function verifyRefreshToken(token: string, options?: VerifyOptions): any;
/**
 * 颁发令牌
 * @param user 用户
 */
declare function getTokens(user: any): {
    accessToken: string;
    refreshToken: string;
};
declare function checkUserIsActive(user: any): void;
/**
 * 守卫函数，用户登陆即可访问
 */
declare function loginRequired(ctx: RouterContext, next: () => Promise<any>): Promise<void>;
/**
 * 守卫函数，用户刷新令牌
 */
declare function refreshTokenRequired(ctx: RouterContext, next: () => Promise<any>): Promise<void>;
/**
 * 守卫函数，用户刷新令牌，统一异常
 */
declare function refreshTokenRequiredWithUnifyException(ctx: RouterContext, next: () => Promise<any>): Promise<void>;
/**
 * 守卫函数，用于权限组鉴权
 */
declare function groupRequired(ctx: RouterContext, next: () => Promise<any>): Promise<void>;
/**
 * 守卫函数，非超级管理员不可访问
 */
declare function adminRequired(ctx: RouterContext, next: () => Promise<any>): Promise<void>;
export { jwt, getTokens, loginRequired, groupRequired, adminRequired, refreshTokenRequired, refreshTokenRequiredWithUnifyException, checkUserIsActive };
