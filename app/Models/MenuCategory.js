"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MenuCategory extends Model {
  menus() {
    return this.hasMany("App/Models/Menu");
  }
}

module.exports = MenuCategory;
