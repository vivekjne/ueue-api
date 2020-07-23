"use strict";

/*
|--------------------------------------------------------------------------
| FoodcourtSeeder
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
const Foodcourt = use("App/Models/Foodcourt");
const { sanitizor } = use("Validator");
const Database = use("Database");
const knexPostgis = require("knex-postgis");
const st = knexPostgis(Database);

class FoodcourtSeeder {
  async run() {
    for (let i = 0; i < 5; i++) {
      const foodcourt = new Foodcourt();
      const name = faker.company();
      foodcourt.name = name;
      foodcourt.slug = sanitizor.slug(name);
      foodcourt.description = faker.paragraph({ sentences: 2 });

      foodcourt.location = st.geomFromText(
        `Point(${faker.longitude()} ${faker.latitude()})`,
        4326
      );
      foodcourt.address = faker.address();
      await foodcourt.save();
    }
    const foodcourts = await Database.table("foodcourts");
    console.log(foodcourts);
  }
}

module.exports = FoodcourtSeeder;
