"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Menu extends Model {
  category() {
    return this.belongsTo("App/Models/MenuCategory");
  }

  menuTypes() {
    return this.belongsTo("App/Models/MenuType");
  }
}

module.exports = Menu;
