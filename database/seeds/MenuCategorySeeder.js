"use strict";

/*
|--------------------------------------------------------------------------
| MenuCategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const MenuCategory = use("App/Models/MenuCategory");
class MenuCategorySeeder {
  async run() {
    const menuItems = ["Chicken", "Snacks", "Shakes"];
    for (let i = 0; i < menuItems.length; i++) {
      const menuCategory = new MenuCategory();
      menuCategory.name = menuItems[i];
      menuCategory.is_featured = true;
      await menuCategory.save();
    }
  }
}

module.exports = MenuCategorySeeder;
