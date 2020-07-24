"use strict";

/*
|--------------------------------------------------------------------------
| MenuTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const MenuType = use("App/Models/MenuType");

class MenuTypeSeeder {
  async run() {
    const menuTypes = [
      {
        name: "Vegetarian",
        icon:
          "https://www.pngkey.com/png/detail/261-2619381_chitr-veg-symbol-svg-veg-and-non-veg.png",
      },
      {
        name: "Non-Vegetarian",
        icon:
          "https://www.pinclipart.com/picdir/big/419-4194820_veg-icon-png-non-veg-logo-png-clipart.png",
      },
    ];
    for (let i = 0; i < menuTypes.length; i++) {
      const menuType = new MenuType();
      menuType.name = menuTypes[i].name;
      menuType.icon = menuTypes[i].icon;
      await menuType.save();
    }
  }
}

module.exports = MenuTypeSeeder;
