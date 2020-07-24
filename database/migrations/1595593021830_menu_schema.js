"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MenuSchema extends Schema {
  up() {
    this.create("menus", (table) => {
      table.increments();
      table.string("name", 254).notNullable();
      table.text("description").nullable();
      table
        .bigInteger("restaurant_id")
        .unsigned()
        .references("id")
        .inTable("restaurants")
        .notNullable();
      table
        .bigInteger("menu_category_id")
        .unsigned()
        .references("id")
        .inTable("menu_categories")
        .notNullable();

      table
        .bigInteger("menu_type_id")
        .unsigned()
        .references("id")
        .inTable("menu_types")
        .notNullable();

      table.integer("stock").defaultTo(0);
      table
        .string("image")
        .nullable()
        .defaultTo("http://lorempixel.com/500/500/food/");

      table.json("ingredients").nullable();
      table.boolean("is_active").defaultTo(true);
      table.timestamps();
    });
  }

  down() {
    this.drop("menus");
  }
}

module.exports = MenuSchema;
