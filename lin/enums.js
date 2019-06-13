"use strict";
/**
 * 枚举
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 是否为超级管理员的枚举
 * COMMON 代表 普通用户
 * ADMIN 代表 超级管理员
 */
var UserAdmin;
(function (UserAdmin) {
    UserAdmin[UserAdmin["COMMON"] = 1] = "COMMON";
    UserAdmin[UserAdmin["ADMIN"] = 2] = "ADMIN";
})(UserAdmin = exports.UserAdmin || (exports.UserAdmin = {}));
/**
 * 当前用户是否为激活状态的枚举
 * ACTIVE 代表 激活状态
 * NOT_ACTIVE 代表 非激活状态
 */
var UserActive;
(function (UserActive) {
    UserActive[UserActive["ACTIVE"] = 1] = "ACTIVE";
    UserActive[UserActive["NOT_ACTIVE"] = 2] = "NOT_ACTIVE";
})(UserActive = exports.UserActive || (exports.UserActive = {}));
/**
 * 令牌的类型
 * ACCESS 代表 access token
 * REFRESH 代表 refresh token
 */
var TokenType;
(function (TokenType) {
    TokenType["ACCESS"] = "access";
    TokenType["REFRESH"] = "refresh";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
