"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Cart extends Model {
  menu() {
    return this.belongsTo("App/Models/Menu");
  }

  restaurant() {
    return this.belongsTo("App/Models/Restaurant", "restaurant_id", "id");
  }
}

module.exports = Cart;
