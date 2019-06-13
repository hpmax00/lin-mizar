"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
/**
 * SSE功能封装类
 */
class SSE extends stream_1.Transform {
    constructor(opts) {
        super(opts);
    }
    _transform(chunk, encoding, cb) {
        this.push(chunk.toString('utf8'));
        cb();
    }
}
exports.SSE = SSE;
/**
 * 消息中间者类
 */
class MessageBroker {
    /**
     * 默认 2000 ms 重发一次
     * @param defaultRetry sse retry
     */
    constructor(defaultRetry = 2000) {
        /**
         * 消息容器
         */
        this.messages = [];
        this.buffer = [];
        this.defaultId = 1;
        this.setRetry(defaultRetry);
    }
    /**
     * 设置 retry 值
     * @param num retry 值
     */
    setRetry(num) {
        this.retry = num;
        this.buffer.push(`retry: ${this.retry}\n`);
    }
    /**
     * 设置 event id
     * @param eventId event id
     */
    setEventId(eventId) {
        if (eventId) {
            this.defaultId = eventId;
            this.buffer.push(`id: ${eventId}\n`);
        }
        else {
            this.buffer.push(`id: ${this.defaultId}\n`);
        }
    }
    /**
     * 重置 event id
     */
    resetEventId() {
        this.setEventId(1);
    }
    /**
     * 自增 event id
     */
    increaseId() {
        this.defaultId += 1;
    }
    /**
     * 添加消息
     * @param event 事件名
     * @param obj 消息体
     * @param flush 是否冲刷buffer，若为true，则将buffer中的数据加入到messages中
     */
    addMessage(event, obj, flush = true) {
        this.setEventId();
        this.buffer.push(`event: ${event}\n`);
        const line = JSON.stringify(obj);
        this.buffer.push(`data: ${line}\n\n`);
        flush && this.flushBuffer();
    }
    /**
     * 冲刷buffer
     */
    flushBuffer() {
        this.messages.push(this.joinBuffer());
        this.buffer.length = 0;
        this.increaseId();
    }
    /**
     * 拼接buffer
     */
    joinBuffer() {
        return this.buffer.join('');
    }
    /**
     * 弹出消息容器中的顶部项
     */
    pop() {
        // 先进先出
        const tmp = this.messages[0];
        this.messages.splice(0, 1);
        return tmp;
    }
    /**
     * 发送心跳
     * @param comment 注释
     */
    heartbeat(comment) {
        // 发送注释 : this is a test stream\n\n 告诉客户端，服务器还活着
        if (comment) {
            this.buffer.push(comment);
        }
        else {
            this.buffer.push(': sse sever is still alive \n\n');
            const tmp = this.joinBuffer();
            this.buffer.length = 0;
            return tmp;
        }
    }
    /**
     * 容器中是否存在消息
     */
    existMessage() {
        return this.messages.length > 0;
    }
}
exports.MessageBroker = MessageBroker;
class Subscription extends stream_1.Readable {
    constructor(opts) {
        super(opts);
        this.value = 0;
    }
    _read() {
        // tslint:disable-next-line: no-empty
        while (this.push(String(this.value++))) { }
    }
}
exports.Subscription = Subscription;
