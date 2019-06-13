"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const exception_1 = require("./exception");
const consola_1 = tslib_1.__importDefault(require("consola"));
const util_1 = require("./util");
const config_1 = require("./config");
const lodash_1 = require("lodash");
const co_busboy_1 = tslib_1.__importDefault(require("co-busboy"));
const stream_wormhole_1 = tslib_1.__importDefault(require("stream-wormhole"));
const path_1 = require("path");
// const Logger = require('egg-logger').Logger;
// const FileTransport = require('egg-logger').FileTransport;
// const ConsoleTransport = require('egg-logger').ConsoleTransport;
/**
 * json序列化扩展
 *
 * ```js
 * ctx.json({ msg:"hello from lin!" })
 * ```
 *
 * @param app app实例
 */
exports.json = (app) => {
    /**
     * hide 表示想要隐藏的属性
     */
    app.context.json = function (obj, hide = []) {
        this.type = 'application/json';
        util_1.unsets(obj, hide);
        let data = Object.create(null);
        if (obj instanceof exception_1.HttpException) {
            transform(obj, data);
            lodash_1.set(data, 'url', this.request.url);
            this.status = obj.code;
        }
        else {
            data = obj;
        }
        this.body = JSON.stringify(data);
    };
};
function transform(obj, data) {
    const fields = lodash_1.get(obj, 'fields', []);
    fields.forEach(field => {
        data[util_1.toLine(field)] = lodash_1.get(obj, field);
    });
}
/**
 * 处理success
 *
 * ```js
 * ctx.success({ msg:"hello from lin!" })
 * ```
 *
 * ```js
 * ctx.success({ code: 200, msg: "hello from lin!", errorCode: 10000 })
 * ```
 *
 * @param app app实例
 */
exports.success = (app) => {
    app.context.success = function (ex) {
        this.type = 'application/json';
        const suc = new exception_1.Success(ex);
        let data = {
            error_code: suc.errorCode,
            msg: suc.msg,
            url: this.req.url
        };
        this.status = suc.code;
        this.body = JSON.stringify(data);
    };
};
/**
 * 日志扩展
 *
 * ```js
 * ctx.logger.info();
 * ctx.logger.warn();
 * ctx.logger.debug();
 * ctx.logger.error();
 * ```
 *
 * @param app app实例
 */
exports.logging = (app) => {
    // const logger = new Logger();
    // logger.set(
    //   'file',
    //   new FileTransport({
    //     file: '/path/to/file',
    //     level: 'INFO'
    //   })
    // );
    // logger.set(
    //   'console',
    //   new ConsoleTransport({
    //     level: 'DEBUG'
    //   })
    // );
    app.context.logger = consola_1.default;
};
/**
 * 解析上传文件
 * @param app app实例
 */
exports.multipart = (app) => {
    app.context.multipart = async function (opts) {
        // multipart/form-data
        if (!this.is('multipart')) {
            throw new Error('Content-Type must be multipart/*');
        }
        // field指表单中的非文件
        const parts = co_busboy_1.default(this, { autoFields: opts && opts.autoFields });
        let part;
        let totalSize = 0;
        const files = [];
        // tslint:disable-next-line:no-conditional-assignment
        while ((part = await parts()) != null) {
            if (part.length) {
                // arrays are busboy fields
            }
            else {
                if (!part.filename) {
                    // user click `upload` before choose a file,
                    // `part` will be file stream, but `part.filename` is empty
                    // must handler this, such as log error.
                    await stream_wormhole_1.default(part);
                    continue;
                }
                // otherwise, it's a stream
                // part.fieldname, part.filename, part.encoding, part.mime
                // _readableState.length
                // part.readableLength 31492 检查单个文件的大小
                // 超过长度，报错
                // 检查extension，报错
                const ext = path_1.extname(part.filename);
                if (!checkFileExtension(ext, opts && opts.include, opts && opts.exclude)) {
                    throw new exception_1.FileExtensionException({ msg: `不支持类型为${ext}的文件` });
                }
                const { valid, conf } = checkSingleFileSize(part._readableState.length, opts && opts.singleLimit);
                if (!valid) {
                    throw new exception_1.FileTooLargeException({
                        msg: `文件单个大小不能超过${conf}b`
                    });
                }
                // 计算总大小
                totalSize += part._readableState.length;
                const tmp = lodash_1.cloneDeep(part);
                files.push(tmp);
                // 恢复再次接受data
                part.resume();
            }
        }
        const { valid, conf } = checkFileNums(files.length, opts && opts.fileNums);
        if (!valid) {
            throw new exception_1.FileTooManyException({ msg: `上传文件数量不能超过${conf}` });
        }
        const { valid: valid1, conf: conf1 } = checkTotalFileSize(totalSize, opts && opts.totalLimit);
        if (!valid1) {
            throw new exception_1.FileTooLargeException({ msg: `总文件体积不能超过${conf1}` });
        }
        return files;
    };
};
function checkSingleFileSize(size, singleLimit) {
    // file_include,file_exclude,file_single_limit,file_total_limit,file_store_dir
    // 默认 2M
    const confSize = singleLimit
        ? singleLimit
        : config_1.config.getItem('file.singleLimit', 1024 * 1024 * 2);
    return {
        valid: confSize > size,
        conf: confSize
    };
}
function checkTotalFileSize(size, totalLimit) {
    // 默认 20M
    const confSize = totalLimit
        ? totalLimit
        : config_1.config.getItem('file.totalLimit', 1024 * 1024 * 20);
    return {
        valid: confSize > size,
        conf: confSize
    };
}
function checkFileNums(nums, fileNums) {
    // 默认 10
    const confNums = fileNums ? fileNums : config_1.config.getItem('file.nums', 10);
    return {
        valid: confNums > nums,
        conf: confNums
    };
}
function checkFileExtension(ext, include, exclude) {
    const fileInclude = include ? include : config_1.config.getItem('file.include');
    const fileExclude = exclude ? exclude : config_1.config.getItem('file.exclude');
    // 如果两者都有取fileInclude，有一者则用一者
    if (fileInclude && fileExclude) {
        if (!Array.isArray(fileInclude)) {
            throw new Error('file_include must an array!');
        }
        return fileInclude.includes(ext);
    }
    else if (fileInclude && !fileExclude) {
        // 有include，无exclude
        if (!Array.isArray(fileInclude)) {
            throw new Error('file_include must an array!');
        }
        return fileInclude.includes(ext);
    }
    else if (fileExclude && !fileInclude) {
        // 有exclude，无include
        if (!Array.isArray(fileExclude)) {
            throw new Error('file_exclude must an array!');
        }
        return !fileExclude.includes(ext);
    }
    else {
        // 二者都没有
        return true;
    }
}
