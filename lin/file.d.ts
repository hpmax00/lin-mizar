/**
 * 上传文件类，所有文件上传的基类
 */
export declare class Uploader {
    private storeDir;
    constructor(storeDir?: string);
    /**
     * 处理文件流Stream
     */
    upload(files: any[]): Promise<void>;
    /**
     * 获得保存的路径名
     * @param filename 文件名
     */
    getStorePath(filename: string): {
        absolutePath: string;
        relativePath: string;
        realName: string;
    };
    /**
     * 生成文件名
     * @param filename 文件名
     */
    generateName(filename: string): string;
    /**
     * 获得确切的保存路径
     */
    getExactStoreDir(formatDay: string): string;
    /**
     * getFormatDay
     */
    getFormatDay(): string;
    /**
     * 生成图片的md5
     */
    generateMd5(data: any): string;
}
