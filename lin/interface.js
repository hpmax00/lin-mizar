"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_1 = tslib_1.__importDefault(require("sequelize"));
const lodash_1 = require("lodash");
const enums_1 = require("./enums");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const password_hash_1 = require("./password-hash");
/**
 * 记录信息的mixin
 */
exports.InfoCrudMixin = {
    attributes: {},
    options: {
        createdAt: 'create_time',
        updatedAt: 'update_time',
        deletedAt: 'delete_time',
        paranoid: true,
        getterMethods: {
            createTime() {
                // @ts-ignore
                return dayjs_1.default(this.getDataValue('create_time')).unix() * 1000;
            },
            updateTime() {
                // @ts-ignore
                return dayjs_1.default(this.getDataValue('update_time')).unix() * 1000;
            }
        }
    }
};
/**
 * 用户接口
 */
exports.UserInterface = {
    attributes: {
        id: {
            type: sequelize_1.default.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nickname: {
            type: sequelize_1.default.STRING({ length: 24 }),
            allowNull: false,
            unique: true
        },
        avatar: {
            // 用户默认生成图像，为null
            type: sequelize_1.default.STRING({ length: 500 }),
            comment: '头像url'
        },
        admin: {
            type: sequelize_1.default.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        active: {
            type: sequelize_1.default.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        email: {
            type: sequelize_1.default.STRING({ length: 100 }),
            unique: true,
            allowNull: true
        },
        group_id: {
            type: sequelize_1.default.INTEGER,
            allowNull: true
        },
        password: {
            type: sequelize_1.default.STRING({ length: 100 }),
            set(ps) {
                // @ts-ignore
                this.setDataValue('password', password_hash_1.generate(ps));
            },
            get() {
                // @ts-ignore
                return this.getDataValue('password');
            }
        }
    },
    options: lodash_1.merge({
        tableName: 'lin_user',
        getterMethods: {
            isAdmin() {
                // @ts-ignore
                return this.getDataValue('admin') === enums_1.UserAdmin.ADMIN;
            },
            isActive() {
                // @ts-ignore
                return this.getDataValue('active') === enums_1.UserActive.ACTIVE;
            }
        }
    }, exports.InfoCrudMixin.options)
};
/**
 * 权限接口
 */
exports.AuthInterface = {
    attributes: {
        id: {
            type: sequelize_1.default.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        group_id: {
            type: sequelize_1.default.INTEGER,
            allowNull: true
        },
        auth: {
            type: sequelize_1.default.STRING({ length: 60 })
        },
        module: {
            type: sequelize_1.default.STRING({ length: 50 })
        }
    },
    options: {
        tableName: 'lin_auth',
        createdAt: false,
        updatedAt: false
    }
};
/**
 * 分组接口
 */
exports.GroupInterface = {
    attributes: {
        id: {
            type: sequelize_1.default.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize_1.default.STRING({ length: 60 })
        },
        info: {
            type: sequelize_1.default.STRING({ length: 255 }),
            allowNull: true
        }
    },
    options: {
        tableName: 'lin_group',
        createdAt: false,
        updatedAt: false
    }
};
/**
 * 日志接口
 */
exports.LogInterface = {
    attributes: {
        id: {
            type: sequelize_1.default.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        message: {
            type: sequelize_1.default.STRING({ length: 450 })
        },
        user_id: {
            type: sequelize_1.default.INTEGER,
            allowNull: false
        },
        user_name: {
            type: sequelize_1.default.STRING(20)
        },
        status_code: {
            type: sequelize_1.default.INTEGER
        },
        method: {
            type: sequelize_1.default.STRING(20)
        },
        path: {
            type: sequelize_1.default.STRING(50)
        },
        authority: {
            type: sequelize_1.default.STRING(100)
        }
    },
    options: {
        tableName: 'lin_log',
        createdAt: 'time',
        updatedAt: false,
        getterMethods: {
            time() {
                // @ts-ignore
                return dayjs_1.default(this.getDataValue('time')).unix() * 1000;
            }
        }
    }
};
/**
 * 文件接口
 */
exports.FileInterface = {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    path: {
        type: sequelize_1.default.STRING({ length: 500 }),
        allowNull: false
    },
    type: {
        type: sequelize_1.default.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1 local，其他表示其他地方'
    },
    name: {
        type: sequelize_1.default.STRING(100),
        allowNull: false
    },
    extension: {
        type: sequelize_1.default.STRING(50)
    },
    size: {
        type: sequelize_1.default.INTEGER,
        allowNull: true
    },
    // 建立索引，方便搜索
    // 域名配置
    md5: {
        type: sequelize_1.default.STRING(40),
        allowNull: true,
        unique: true,
        comment: '图片md5值，防止上传重复图片'
    }
};
