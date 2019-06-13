export interface Option {
    algorithm?: string;
    saltLength?: number;
    iterations?: number;
}
/**
 * 生成密文密码
 * @param password 密码
 * @param options 参数
 */
export declare const generate: (password: string, options?: Option | undefined) => string;
/**
 * 校验密码
 * @param password 原始密码
 * @param hashedPassword 密文密码
 */
export declare const verify: (password: string, hashedPassword: string) => boolean;
/**
 * 判断当前密码是否为密文
 * @param password 密码
 */
export declare const isHashed: (password: string) => boolean;
