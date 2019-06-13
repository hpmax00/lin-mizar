"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const util_1 = require("./util");
const core_1 = require("./core");
/**
 * lin-router继承自koa-router
 * 即可使用全部的koa-router api
 * 也可使用以 lin 为前缀的方法，用于视图函数的权限
 */
class LinRouter extends koa_router_1.default {
    linOption(name, path, meta, ...middleware) {
        if (meta && meta.mount) {
            util_1.assert(!!(meta.auth && meta.module), 'auth and module must not be empty, if you want to mount');
            const endpoint = 'OPTION ' + name;
            core_1.routeMetaInfo.set(endpoint, { auth: meta.auth, module: meta.module });
        }
        return this.options(name, path, ...middleware);
    }
    linHead(name, path, meta, ...middleware) {
        if (meta && meta.mount) {
            util_1.assert(!!(meta.auth && meta.module), 'auth and module must not be empty, if you want to mount');
            const endpoint = 'HEAD ' + name;
            core_1.routeMetaInfo.set(endpoint, { auth: meta.auth, module: meta.module });
        }
        return this.head(name, path, ...middleware);
    }
    linGet(name, path, meta, ...middleware) {
        if (meta && meta.mount) {
            util_1.assert(!!(meta.auth && meta.module), 'auth and module must not be empty, if you want to mount');
            const endpoint = 'GET ' + name;
            core_1.routeMetaInfo.set(endpoint, { auth: meta.auth, module: meta.module });
        }
        return this.get(name, path, ...middleware);
    }
    linPut(name, path, meta, ...middleware) {
        if (meta && meta.mount) {
            util_1.assert(!!(meta.auth && meta.module), 'auth and module must not be empty, if you want to mount');
            const endpoint = 'PUT ' + name;
            core_1.routeMetaInfo.set(endpoint, { auth: meta.auth, module: meta.module });
        }
        return this.put(name, path, ...middleware);
    }
    linPatch(name, path, meta, ...middleware) {
        if (meta && meta.mount) {
            util_1.assert(!!(meta.auth && meta.module), 'auth and module must not be empty, if you want to mount');
            const endpoint = 'PATCH ' + name;
            core_1.routeMetaInfo.set(endpoint, { auth: meta.auth, module: meta.module });
        }
        return this.patch(name, path, ...middleware);
    }
    linPost(name, path, meta, ...middleware) {
        if (meta && meta.mount) {
            util_1.assert(!!(meta.auth && meta.module), 'auth and module must not be empty, if you want to mount');
            const endpoint = 'POST ' + name;
            core_1.routeMetaInfo.set(endpoint, { auth: meta.auth, module: meta.module });
        }
        return this.post(name, path, ...middleware);
    }
    linDelete(name, path, meta, ...middleware) {
        if (meta && meta.mount) {
            util_1.assert(!!(meta.auth && meta.module), 'auth and module must not be empty, if you want to mount');
            const endpoint = 'DELETE ' + name;
            core_1.routeMetaInfo.set(endpoint, { auth: meta.auth, module: meta.module });
        }
        return this.delete(name, path, ...middleware);
    }
}
exports.LinRouter = LinRouter;
