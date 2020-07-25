"use strict";

/*
|--------------------------------------------------------------------------
| MenuSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Menu = use("App/Models/Menu");
const Restaurant = use("App/Models/Restaurant");

class MenuSeeder {
  async run() {
    const restaurant_ids = await Restaurant.all();

    const menus = [
      {
        name: "Chilli Chicken",
        description:
          "Chilli chicken is one of the most popular Indo-chinese style chicken appetizer or starter that is served in Chinese restaurants across the globe.",
        menu_category_id: 1,
        menu_type_id: 2,
        image:
          "https://i.ndtvimg.com/i/2017-09/chilli-chicken_806x605_61506419309.jpg",
        ingredients: JSON.stringify({
          "Boneless Chicken": "400gms",
          Salt: "1 1/2 tbsp",
          cornflour: "4 tbsp",
        }),
        price_variants: JSON.stringify([
          {
            title: "Half",
            price: 180.0,
          },
          {
            title: "Full",
            price: 230.0,
          },
        ]),
      },

      {
        name: "Sharjah Shake",
        description:
          "Sharjah Shake is one of the common Shakes that we get bakers across kerala.",
        menu_category_id: 3,
        menu_type_id: 1,
        image:
          "https://img-global.cpcdn.com/recipes/fd7395aaa57084eb/751x532cq70/sharjah-shake-recipe-main-photo.jpg",
        ingredients: JSON.stringify({
          Milk: "1.2 litre",
          bananas: "2(Njalipoovan)",
          horlicks: "2 tbsp",
          sugar: "3 tbsp",
          "Vanilla Ice Cream": "1 scoop",
        }),
        price_variants: JSON.stringify([
          {
            title: "Normal",
            price: 80.0,
          },
          {
            title: "Special",
            price: 150.0,
          },
        ]),
      },
    ];
    for (let k = 0; k < restaurant_ids.rows.length; k++) {
      for (let i = 0; i < menus.length; i++) {
        const menu = new Menu();
        menu.name = menus[i].name;
        menu.description = menus[i].description;
        menu.menu_category_id = menus[i].menu_category_id;
        menu.menu_type_id = menus[i].menu_type_id;
        menu.image = menus[i].image;
        menu.ingredients = menus[i].ingredients;
        menu.restaurant_id = restaurant_ids.rows[k].id;
        menu.price_variants = menus[i].price_variants;

        await menu.save();
      }
    }
  }
}

module.exports = MenuSeeder;
