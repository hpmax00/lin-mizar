"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * 文件上传相关
 * file_include,file_exclude,file_single_limit,file_total_limit,file_store_dir,siteDomain
 * id,path,type,name,extension,size,md5
 */
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const path_1 = tslib_1.__importDefault(require("path"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const config_1 = require("./config");
const util_1 = require("./util");
/**
 * 上传文件类，所有文件上传的基类
 */
class Uploader {
    constructor(storeDir) {
        this.storeDir = storeDir;
    }
    /**
     * 处理文件流Stream
     */
    async upload(files) {
        throw new Error('you must overload this method');
    }
    /**
     * 获得保存的路径名
     * @param filename 文件名
     */
    getStorePath(filename) {
        const filename2 = this.generateName(filename);
        const formatDay = this.getFormatDay();
        const dir = this.getExactStoreDir(formatDay);
        const exists = fs_1.default.existsSync(dir);
        if (!exists) {
            util_1.mkdirsSync(dir);
        }
        return {
            absolutePath: path_1.default.join(dir, filename2),
            relativePath: `${formatDay}/${filename2}`,
            realName: filename2
        };
    }
    /**
     * 生成文件名
     * @param filename 文件名
     */
    generateName(filename) {
        const ext = path_1.default.extname(filename);
        return `${uuid_1.default.v4()}${ext}`;
    }
    /**
     * 获得确切的保存路径
     */
    getExactStoreDir(formatDay) {
        let storeDir = config_1.config.getItem('file.storeDir');
        if (!storeDir) {
            throw new Error('storeDir must not be undefined');
        }
        this.storeDir && (storeDir = this.storeDir);
        const extrat = path_1.default.isAbsolute(storeDir)
            ? path_1.default.join(storeDir, formatDay)
            : path_1.default.join(process.cwd(), storeDir, formatDay);
        return extrat;
    }
    /**
     * getFormatDay
     */
    getFormatDay() {
        return dayjs_1.default().format('YYYY/MM/DD');
    }
    /**
     * 生成图片的md5
     */
    generateMd5(data) {
        const buf = data._readableState.buffer.head.data;
        const md5 = crypto_1.default.createHash('md5');
        return md5.update(buf).digest('hex');
    }
}
exports.Uploader = Uploader;
