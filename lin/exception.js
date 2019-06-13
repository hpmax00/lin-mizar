"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const lodash_1 = require("lodash");
/**
 * HttpException 是lin中所有其他异常的基类
 *
 * ```js
 * // 实例化一个默认的HttpException
 * const ex = new HttpException();
 *
 * // 实例化一个带参的HttpException
 * const ex = new HttpException({ msg: "想给你一个信息呢！" });
 *
 * // 也可以是其他参数
 * const ex = new HttpException({ errorCode: 10010 });
 *
 * // 也可以指定所有参数
 * const ex = new HttpException({ errorCode: 10010, msg: "想给你一个信息呢！", code: 200 });
 * ```
 */
class HttpException extends Error {
    /**
     * 构造函数
     * @param ex 可选参数，通过{}的形式传入
     */
    constructor(ex) {
        super();
        /**
         * http 状态码
         */
        this.code = 500;
        /**
         * 返回的信息内容
         */
        this.msg = '服务器未知错误';
        /**
         * 特定的错误码
         */
        this.errorCode = 999;
        this.fields = ['msg', 'errorCode'];
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.HttpException = HttpException;
/**
 * 成功
 */
class Success extends HttpException {
    constructor(ex) {
        super();
        this.code = 201;
        this.msg = '成功';
        this.errorCode = 0;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.Success = Success;
/**
 * 失败
 */
class Failed extends HttpException {
    constructor(ex) {
        super();
        this.code = 400;
        this.msg = '失败';
        this.errorCode = 9999;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.Failed = Failed;
/**
 * 认证失败
 */
class AuthFailed extends HttpException {
    constructor(ex) {
        super();
        this.code = 401;
        this.msg = '认证失败';
        this.errorCode = 10000;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.AuthFailed = AuthFailed;
/**
 * 资源不存在
 */
class NotFound extends HttpException {
    constructor(ex) {
        super();
        this.code = 404;
        this.msg = '资源不存在';
        this.errorCode = 10020;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.NotFound = NotFound;
/**
 * 参数错误
 */
class ParametersException extends HttpException {
    constructor(ex) {
        super();
        this.code = 400;
        this.msg = '参数错误';
        this.errorCode = 10030;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.ParametersException = ParametersException;
/**
 * 令牌失效或损坏
 */
class InvalidTokenException extends HttpException {
    constructor(ex) {
        super();
        this.code = 401;
        this.msg = '令牌失效';
        this.errorCode = 10040;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.InvalidTokenException = InvalidTokenException;
/**
 * 令牌过期
 */
class ExpiredTokenException extends HttpException {
    constructor(ex) {
        super();
        this.code = 422;
        this.msg = '令牌过期';
        this.errorCode = 10050;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.ExpiredTokenException = ExpiredTokenException;
/**
 * 服务器未知错误
 */
class UnknownException extends HttpException {
    constructor(ex) {
        super();
        this.code = 400;
        this.msg = '服务器未知错误';
        this.errorCode = 999;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.UnknownException = UnknownException;
/**
 * 字段重复
 */
class RepeatException extends HttpException {
    constructor(ex) {
        super();
        this.code = 400;
        this.msg = '字段重复';
        this.errorCode = 10060;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.RepeatException = RepeatException;
/**
 * 不可操作
 */
class Forbidden extends HttpException {
    constructor(ex) {
        super();
        this.code = 403;
        this.msg = '不可操作';
        this.errorCode = 10070;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.Forbidden = Forbidden;
/**
 * 请求方法不允许
 */
class MethodNotAllowed extends HttpException {
    constructor(ex) {
        super();
        this.code = 405;
        this.msg = '请求方法不允许';
        this.errorCode = 10080;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.MethodNotAllowed = MethodNotAllowed;
/**
 * refresh token 获取失败
 */
class RefreshException extends HttpException {
    constructor(ex) {
        super();
        this.code = 401;
        this.msg = 'refresh token 获取失败';
        this.errorCode = 10100;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.RefreshException = RefreshException;
/**
 * 文件体积过大
 */
class FileTooLargeException extends HttpException {
    constructor(ex) {
        super();
        this.code = 413;
        this.msg = '文件体积过大';
        this.errorCode = 10110;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.FileTooLargeException = FileTooLargeException;
/**
 * 文件数量过多
 */
class FileTooManyException extends HttpException {
    constructor(ex) {
        super();
        this.code = 413;
        this.msg = '文件数量过多';
        this.errorCode = 10120;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.FileTooManyException = FileTooManyException;
/**
 * 文件扩展名不符合规范
 */
class FileExtensionException extends HttpException {
    constructor(ex) {
        super();
        this.code = 401;
        this.msg = '文件扩展名不符合规范';
        this.errorCode = 10130;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.FileExtensionException = FileExtensionException;
/**
 * 请求过于频繁，请稍后重试
 */
class LimitException extends HttpException {
    constructor(ex) {
        super();
        this.code = 401;
        this.msg = '请求过于频繁，请稍后重试';
        this.errorCode = 10140;
        if (ex && ex.code) {
            assert_1.default(lodash_1.isInteger(ex.code));
            this.code = ex.code;
        }
        if (ex && ex.msg) {
            this.msg = ex.msg;
        }
        if (ex && ex.errorCode) {
            assert_1.default(lodash_1.isInteger(ex.errorCode));
            this.errorCode = ex.errorCode;
        }
    }
}
exports.LimitException = LimitException;
