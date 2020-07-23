"use strict";

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const User = use("App/Models/User");
const Chance = require("chance");
const Hash = use("Hash");
const Database = use("Database");
const knexPostgis = require("knex-postgis");
const st = knexPostgis(Database);

// Instantiate Chance so it can be used
const faker = new Chance();
class UserSeeder {
  async run() {
    for (let i = 0; i < 5; i++) {
      const user = new User();
      (user.firstname = faker.name()),
        (user.lastname = faker.last()),
        (user.username = faker.username()),
        (user.password = await Hash.make(faker.password())),
        (user.email = faker.email()),
        (user.location = st.geomFromText(
          `Point(${faker.longitude()} ${faker.latitude()})`,
          4326
        ));
      await user.save();
    }
    const users = await Database.table("users");
    console.log(users);
  }
}

module.exports = UserSeeder;
