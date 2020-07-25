"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MenuSchema extends Schema {
  up() {
    this.table("menus", (table) => {
      // alter table
      table.json("price_variants");
    });
  }

  down() {
    this.table("menus", (table) => {
      // reverse alternations
    });
  }
}

module.exports = MenuSchema;
