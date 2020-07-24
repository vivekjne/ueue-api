"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RestaurantSchema extends Schema {
  up() {
    this.create("restaurants", (table) => {
      table.increments();
      table.string("name").notNullable();
      table.string("slug").notNullable();
      table.text("description").nullable();
      table.string("address", 254).notNullable();
      table.specificType("location", "geometry(point, 4326)").notNullable();
      table
        .string("image")
        .nullable()
        .defaultTo("http://lorempixel.com/500/500/food/");
      table
        .bigInteger("foodcourt_id")
        .unsigned()
        .references("id")
        .inTable("foodcourts")
        .notNullable()
        .onDelete("CASCADE");
      table.boolean("featured").defaultTo(false);
      table
        .string("featured_banner")
        .nullable()
        .defaultTo("https://via.placeholder.com/640x360");
      table.boolean("is_active").defaultTo(true);
      table.timestamps();
    });
  }

  down() {
    this.drop("restaurants");
  }
}

module.exports = RestaurantSchema;
