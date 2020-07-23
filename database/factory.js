"use strict";

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");
const Hash = use("Hash");
const knexPostgis = require("knex-postgis");
const st = knexPostgis(Database);
const { sanitizor  } = use('Validator')
Factory.blueprint("App/Models/User", (faker) => {
  console.log(
    st.geomFromText(`Point(${faker.longitude()} ${faker.latitude()})`, 4326)
  );
  return {
    firstname: faker.name(),
    lastname: faker.last(),
    username: faker.username(),
    password: faker.password(),
    email: faker.email(),
    location: st.geomFromText(
      `Point(${faker.longitude()} ${faker.latitude()})`,
      4326
    ),
  };
});



Factory.blueprint( "App/Models/Foodcourt", (faker) => {
    const name =  faker.company()
    return {
      name,
      slug: sanitizor.slug(name),
      username: faker.username(),
      description: faker.password(),
      email: faker.email(),
      location: st.geomFromText(
        `Point(${faker.longitude()} ${faker.latitude()})`,
        4326
      ),
    };
  });
  
// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     firstname:faker.firstName(),
//     lastname:faker.lastName(),
//     username: faker.username(),
//     email: faker.email(),
//     location:st.geomFromText(`Point(${faker.longitude()} ${faker.latitude()})`, 4326),
//     password: await Hash.make(faker.password())
//   }
// })
