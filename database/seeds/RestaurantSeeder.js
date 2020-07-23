"use strict";

/*
|--------------------------------------------------------------------------
| RestaurantSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Chance = require("chance");
const faker = new Chance();
const Restaurant = use("App/Models/Restaurant");
const { sanitizor } = use("Validator");
const Database = use("Database");
const knexPostgis = require("knex-postgis");
const st = knexPostgis(Database);

class RestaurantSeeder {
  async run() {
    for (let i = 0; i < 5; i++) {
      const foodcourt = new Foodcourt();
      const name = faker.company();
      restaurant.name = name;
      restaurant.slug = sanitizor.slug(name);
      restaurant.description = faker.paragraph({ sentences: 2 });

      restaurant.location = st.geomFromText(
        `Point(${faker.longitude()} ${faker.latitude()})`,
        4326
      );
      restaurant.address = faker.address();
      restaurant.foodcourt_id = 1;

      await restaurant.save();
    }
    const foodcourts = await Database.table("foodcourts");
    console.log(foodcourts);
  }
}

module.exports = RestaurantSeeder;
