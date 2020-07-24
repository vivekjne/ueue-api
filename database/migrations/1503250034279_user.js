"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("name", 100).nullable();

      table.string("email", 254).nullable().unique();
      table.string("password", 60).nullable();
      table.enu("provider", ["email", "google", "facebook"]).notNullable();
      table.text("providerKey").nullable();
      table.string("userId", 100).nullable().unique();
      table.text("photo").nullable();

      table.specificType("location", "geometry(point, 4326)");
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
