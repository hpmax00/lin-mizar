'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const assert_1 = tslib_1.__importDefault(require("assert"));
const mkdirp_1 = tslib_1.__importDefault(require("mkdirp"));
const utility_1 = tslib_1.__importDefault(require("utility"));
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const depd = require('depd')('egg-logger');
const utils = require('egg-logger/lib/utils');
const egg_logger_1 = require("egg-logger");
/**
 * output log into file {@link Transport}。
 */
class FileTransport extends egg_logger_1.Transport {
    /**
     * @constructor
     * @param {Object} options
     * - {String} file - file path
     * - {String} [level = INFO] - log level
     */
    constructor(options) {
        super(options);
        this.logCount = 1;
        assert_1.default(this.options.dir, 'should pass options.dir');
        assert_1.default(this.options.sizeLimit, 'should pass options.sizeLimit');
        this._stream = null;
        this.logCount = 1;
        this.reload();
    }
    get defaults() {
        // @ts-ignore
        return utils.assign(super.defaults, {
            file: null,
            level: 'INFO'
        });
    }
    /**
     * reload file stream
     */
    reload() {
        this._closeStream();
        this._stream = this._createStream();
    }
    /**
     * output log, see {@link Transport#log}
     * @param  {String} level - log level
     * @param  {Array} args - all arguments
     * @param  {Object} meta - meta information
     */
    log(level, args, meta) {
        // 根据日期
        // 每一天
        const filename = this.checkIsPresent();
        // 为false，则文件名需要更新
        // 存在，则判断是否溢出
        if (filename) {
            const overflow = this.checkSizeOverflow(filename);
            // 如果溢出，logCount ++ , reload
            if (overflow) {
                this.logCount += 1;
                this.reload();
            }
        }
        else {
            this.logCount = 1;
            this.reload();
        }
        if (!this.writable) {
            const err = new Error(`${this.options.file} log stream had been closed`);
            console.error(err.stack);
            return;
        }
        const buf = super.log(level, args, meta);
        // @ts-ignore
        if (buf.length) {
            this._write(buf);
        }
    }
    /**
     * 检查当前的日志文件是否为当天
     */
    checkIsPresent() {
        // 检查前面的日志
        // 2019-05-29.1.log
        const filename = this.getPresentFilename();
        const exist = fs_1.default.existsSync(filename);
        if (exist) {
            return filename;
        }
        else {
            return false;
        }
    }
    getPresentFilename() {
        const dir = path_1.default.isAbsolute(this.options.dir)
            ? this.options.dir
            : path_1.default.join(process.cwd(), this.options.dir);
        const today = dayjs_1.default().format('YYYY-MM-DD');
        const filename = path_1.default.join(dir, `${today}.${this.logCount}.log`);
        return filename;
    }
    checkSizeOverflow(filename) {
        // sizeLimit 一定得传进来
        const limit = this.options.sizeLimit;
        const status = fs_1.default.statSync(filename);
        // 是否溢出
        return status.size > limit;
    }
    /**
     * close stream
     */
    close() {
        this._closeStream();
    }
    /**
     * @deprecated
     */
    end() {
        depd('transport.end() is deprecated, use transport.close()');
        this.close();
    }
    /**
     * write stream directly
     * @param {Buffer|String} buf - log content
     * @private
     */
    _write(buf) {
        this._stream.write(buf);
    }
    /**
     * transport is writable
     * @return {Boolean} writable
     */
    get writable() {
        return (this._stream &&
            // @ts-ignore
            !this._stream.closed &&
            this._stream.writable &&
            // @ts-ignore
            !this._stream.destroyed);
    }
    /**
     * create stream
     * @return {Stream} return writeStream
     * @private
     */
    _createStream() {
        // 获得文件名
        const filename = this.getPresentFilename();
        // 获得文件夹名
        const dirp = path_1.default.dirname(filename);
        // 创建文件夹
        if (!fs_1.default.existsSync(dirp)) {
            mkdirp_1.default.sync(dirp);
        }
        const stream = fs_1.default.createWriteStream(filename, { flags: 'a' });
        const onError = err => {
            console.error('%s ERROR %s [logger] [%s] %s', utility_1.default.logDate(','), process.pid, filename, err.stack);
            this.reload();
            console.warn('%s WARN %s [logger] [%s] reloaded', utility_1.default.logDate(','), process.pid, filename);
        };
        // only listen error once because stream will reload after error
        stream.once('error', onError);
        // @ts-ignore
        stream._onError = onError;
        return stream;
    }
    /**
     * close stream
     * @private
     */
    _closeStream() {
        if (this._stream) {
            this._stream.end();
            // @ts-ignore
            this._stream.removeListener('error', this._stream._onError);
            this._stream = null;
        }
    }
}
exports.FileTransport = FileTransport;
