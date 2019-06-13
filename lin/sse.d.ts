/// <reference types="node" />
import { Transform, Readable, TransformCallback } from 'stream';
/**
 * SSE功能封装类
 */
export declare class SSE extends Transform {
    constructor(opts?: any);
    _transform(chunk: any, encoding: string, cb: TransformCallback): void;
}
/**
 * 消息中间者类
 */
export declare class MessageBroker {
    /**
     * 消息容器
     */
    messages: string[];
    private retry;
    private buffer;
    private defaultId;
    /**
     * 默认 2000 ms 重发一次
     * @param defaultRetry sse retry
     */
    constructor(defaultRetry?: number);
    /**
     * 设置 retry 值
     * @param num retry 值
     */
    setRetry(num: number): void;
    /**
     * 设置 event id
     * @param eventId event id
     */
    setEventId(eventId?: number): void;
    /**
     * 重置 event id
     */
    resetEventId(): void;
    /**
     * 自增 event id
     */
    increaseId(): void;
    /**
     * 添加消息
     * @param event 事件名
     * @param obj 消息体
     * @param flush 是否冲刷buffer，若为true，则将buffer中的数据加入到messages中
     */
    addMessage(event: string, obj: any, flush?: boolean): void;
    /**
     * 冲刷buffer
     */
    flushBuffer(): void;
    /**
     * 拼接buffer
     */
    joinBuffer(): string;
    /**
     * 弹出消息容器中的顶部项
     */
    pop(): string;
    /**
     * 发送心跳
     * @param comment 注释
     */
    heartbeat(comment?: string): string | undefined;
    /**
     * 容器中是否存在消息
     */
    existMessage(): boolean;
}
export declare class Subscription extends Readable {
    value: number;
    constructor(opts?: any);
    _read(): void;
}
