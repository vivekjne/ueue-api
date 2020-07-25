"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RestaurantSchema extends Schema {
  up() {
    this.table("restaurants", (table) => {
      // alter table
      table.string("currency", 5).defaultTo("INR");
      table.string("currency_code", 10).defaultTo("र");
    });
  }

  down() {
    this.table("restaurants", (table) => {
      // reverse alternations
    });
  }
}

module.exports = RestaurantSchema;
