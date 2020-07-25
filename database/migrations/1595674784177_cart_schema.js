"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CartSchema extends Schema {
  up() {
    this.create("carts", (table) => {
      table.increments();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .notNullable()
        .onDelete("CASCADE")
        .notNullable();

      table
        .integer("menu_id")
        .unsigned()
        .references("id")
        .inTable("menus")
        .notNullable()
        .onDelete("CASCADE")
        .notNullable();

      table
        .integer("restaurant_id")
        .unsigned()
        .references("id")
        .inTable("restaurants")
        .notNullable()
        .onDelete("CASCADE")
        .notNullable();

      table.decimal("qty").notNullable();
      table.json("price").notNullable();
      table.decimal("item_total").notNullable();

      table.timestamps();
    });
  }

  down() {
    this.drop("carts");
  }
}

module.exports = CartSchema;
