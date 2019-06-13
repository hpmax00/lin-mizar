/**
 * returned body when error
 */
export declare type RatelimitExpires = (expires: number, url: string) => any;
export interface RatelimitOptions {
    /**
     * database connection
     */
    db: any;
    /**
     * limit duration in milliseconds [1 hour]
     */
    duration?: number;
    /**
     * max requests per 'id' default: 2500
     */
    max?: number;
    /**
     * id to compare requests default: ip
     */
    id?: (ctx: any) => any;
    /**
     * redis key prefix default: "limit"
     */
    prefix?: string;
    /**
     * special key for indentify
     */
    endpoint?: string;
    /**
     * array of ids to whitelist
     */
    whitelist?: string[];
    /**
     * array of ids to blacklist
     */
    blacklist?: string[];
    /**
     * throw on rate limit exceeded default: false
     */
    throw?: boolean;
    /**
     * error returned as the body of the response
     */
    errorMessage?: string | RatelimitExpires;
    /**
     * custom header names
     */
    headers?: {
        /**
         * remaining number of requests default: 'X-RateLimit-Remaining'
         */
        remaining?: string;
        /**
         * reset timestamp default: 'X-RateLimit-Reset'
         */
        reset?: string;
        /**
         * total number of requests default: 'X-RateLimit-Limit'
         */
        total?: string;
    };
    logging?: boolean;
}
/**
 * Initialize ratelimit middleware with the given `opts`
 */
export declare function ratelimit(options: RatelimitOptions): (ctx: any, next: any) => Promise<any>;
