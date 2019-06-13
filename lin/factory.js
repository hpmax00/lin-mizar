"use strict";
/**
 * 工厂方法
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
function modelExtend(superModel, attributes) {
    superModel.tableAttributes = Object.assign({}, superModel.tableAttributes, attributes);
    const model = class extends superModel {
    };
    Object.keys(attributes).forEach(key => {
        Object.defineProperty(model.prototype, key, {
            get() {
                return this.dataValues && this.dataValues[key];
            }
        });
    });
    return model;
}
exports.modelExtend = modelExtend;
