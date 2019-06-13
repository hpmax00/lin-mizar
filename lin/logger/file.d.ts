/// <reference types="node" />
import fs from 'fs';
import { Transport } from 'egg-logger';
/**
 * output log into file {@link Transport}。
 */
export declare class FileTransport extends Transport {
    _stream: fs.WriteStream | null;
    options: any;
    logCount: number;
    /**
     * @constructor
     * @param {Object} options
     * - {String} file - file path
     * - {String} [level = INFO] - log level
     */
    constructor(options: any);
    readonly defaults: any;
    /**
     * reload file stream
     */
    reload(): void;
    /**
     * output log, see {@link Transport#log}
     * @param  {String} level - log level
     * @param  {Array} args - all arguments
     * @param  {Object} meta - meta information
     */
    log(level: any, args: any, meta: any): void;
    /**
     * 检查当前的日志文件是否为当天
     */
    checkIsPresent(): string | false;
    getPresentFilename(): string;
    checkSizeOverflow(filename: string): boolean;
    /**
     * close stream
     */
    close(): void;
    /**
     * @deprecated
     */
    end(): void;
    /**
     * write stream directly
     * @param {Buffer|String} buf - log content
     * @private
     */
    _write(buf: any): void;
    /**
     * transport is writable
     * @return {Boolean} writable
     */
    readonly writable: boolean | null;
    /**
     * create stream
     * @return {Stream} return writeStream
     * @private
     */
    _createStream(): fs.WriteStream;
    /**
     * close stream
     * @private
     */
    _closeStream(): void;
}
