import Sequelize from 'sequelize';
/**
 * 记录信息的mixin
 */
export declare const InfoCrudMixin: {
    attributes: {};
    options: {
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
        paranoid: boolean;
        getterMethods: {
            createTime(): any;
            updateTime(): any;
        };
    };
};
/**
 * 用户接口
 */
export declare const UserInterface: {
    attributes: {
        id: {
            type: Sequelize.IntegerDataTypeConstructor;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        nickname: {
            type: Sequelize.StringDataType;
            allowNull: boolean;
            unique: boolean;
        };
        avatar: {
            type: Sequelize.StringDataType;
            comment: string;
        };
        admin: {
            type: Sequelize.TinyIntegerDataTypeConstructor;
            allowNull: boolean;
            defaultValue: number;
        };
        active: {
            type: Sequelize.TinyIntegerDataTypeConstructor;
            allowNull: boolean;
            defaultValue: number;
        };
        email: {
            type: Sequelize.StringDataType;
            unique: boolean;
            allowNull: boolean;
        };
        group_id: {
            type: Sequelize.IntegerDataTypeConstructor;
            allowNull: boolean;
        };
        password: {
            type: Sequelize.StringDataType;
            set(ps: any): void;
            get(): any;
        };
    };
    options: {
        tableName: string;
        getterMethods: {
            isAdmin(): any;
            isActive(): any;
        };
    } & {
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
        paranoid: boolean;
        getterMethods: {
            createTime(): any;
            updateTime(): any;
        };
    };
};
/**
 * 权限接口
 */
export declare const AuthInterface: {
    attributes: {
        id: {
            type: Sequelize.IntegerDataTypeConstructor;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        group_id: {
            type: Sequelize.IntegerDataTypeConstructor;
            allowNull: boolean;
        };
        auth: {
            type: Sequelize.StringDataType;
        };
        module: {
            type: Sequelize.StringDataType;
        };
    };
    options: {
        tableName: string;
        createdAt: boolean;
        updatedAt: boolean;
    };
};
/**
 * 分组接口
 */
export declare const GroupInterface: {
    attributes: {
        id: {
            type: Sequelize.IntegerDataTypeConstructor;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        name: {
            type: Sequelize.StringDataType;
        };
        info: {
            type: Sequelize.StringDataType;
            allowNull: boolean;
        };
    };
    options: {
        tableName: string;
        createdAt: boolean;
        updatedAt: boolean;
    };
};
/**
 * 日志接口
 */
export declare const LogInterface: {
    attributes: {
        id: {
            type: Sequelize.IntegerDataTypeConstructor;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        message: {
            type: Sequelize.StringDataType;
        };
        user_id: {
            type: Sequelize.IntegerDataTypeConstructor;
            allowNull: boolean;
        };
        user_name: {
            type: Sequelize.StringDataType;
        };
        status_code: {
            type: Sequelize.IntegerDataTypeConstructor;
        };
        method: {
            type: Sequelize.StringDataType;
        };
        path: {
            type: Sequelize.StringDataType;
        };
        authority: {
            type: Sequelize.StringDataType;
        };
    };
    options: {
        tableName: string;
        createdAt: string;
        updatedAt: boolean;
        getterMethods: {
            time(): any;
        };
    };
};
/**
 * 文件接口
 */
export declare const FileInterface: {
    id: {
        type: Sequelize.IntegerDataTypeConstructor;
        primaryKey: boolean;
        autoIncrement: boolean;
    };
    path: {
        type: Sequelize.StringDataType;
        allowNull: boolean;
    };
    type: {
        type: Sequelize.TinyIntegerDataTypeConstructor;
        allowNull: boolean;
        defaultValue: number;
        comment: string;
    };
    name: {
        type: Sequelize.StringDataType;
        allowNull: boolean;
    };
    extension: {
        type: Sequelize.StringDataType;
    };
    size: {
        type: Sequelize.IntegerDataTypeConstructor;
        allowNull: boolean;
    };
    md5: {
        type: Sequelize.StringDataType;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
};
