/**
 * 工厂方法
 */
/**
 * 扩展模型
 * @param superModel 基础模型
 * @param attributes 扩展的属性
 *
 * ```js
 * const { modelExtend } = require("lin-mizar/lin/factory");
 * const { User } = require("lin-mizar");
 * const Sequelize = require("sequelize");
 *
 * const User2 = modelExtend(User, {
 * phone: {
 *  type: Sequelize.STRING(30),
 *  unique: true,
 *  allowNull: true
 *  }
 * });
 *
 * User2.prototype.sayHello = function () {
 *  console.log("hello world!");
 * };
 *
 * module.exports = { User2 };
 * ```
 */
export declare function modelExtend(superModel: any, attributes: any): {
    new (): {
        [x: string]: any;
    };
    [x: string]: any;
};
