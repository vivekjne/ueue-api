"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MenuCategorySchema extends Schema {
  up() {
    this.create("menu_categories", (table) => {
      table.increments();
      table.string("name").notNullable();
      table.boolean("is_active").defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("menu_categories");
  }
}

module.exports = MenuCategorySchema;
