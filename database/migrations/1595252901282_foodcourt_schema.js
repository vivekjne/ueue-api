"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FoodCourtSchema extends Schema {
  up() {
    this.create("foodcourts", (table) => {
      table.increments();
      table.string("name", 254).notNullable();
      table.string("slug", 254).notNullable();
      table.text("description");
      table.specificType("location", "geometry(point, 4326)").notNullable();
      table.string("address", 254).notNullable();
      table.boolean("featured").defaultTo(false);
      table.boolean("is_active").defaultTo(true);
      table.timestamps();
    });
  }

  down() {
    this.drop("foodcourts");
  }
}

module.exports = FoodCourtSchema;
