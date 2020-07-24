"use strict";
const Restaurant = use("App/Models/Restaurant");
const Menu = use("App/Models/Menu");
const MenuCategory = use("App/Models/MenuCategory");

const Database = use("Database");
const knexPostgis = require("knex-postgis");
var geoip = require("geoip-lite");

const st = knexPostgis(Database);
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with restaurants
 */
class RestaurantController {
  /**
   * Show a list of all restaurants.
   * GET restaurants
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    try {
      const page = request.get().page || 1;
      const limit = request.get().limit || 10;

      const ip = request.ip();
      const geo = geoip.lookup(ip);
      console.log(geo);
      const longitude = (geo && geo.ll[1]) || 76.536949;
      const latitude = (geo && geo.ll[0]) || 9.01181;

      const restaurants = await Restaurant.query()
        .select(
          "id",
          "name",
          "slug",
          "description",
          "image",
          st.asGeoJSON("location"),
          st.distance(
            st.geography("location"),
            st.geography(st.geometry(`Point(${longitude} ${latitude})`, 4326))
          ),
          "address"
        )
        .orderBy("st_distance", "asc")
        .paginate(page, limit);
      for (let i = 0; i < restaurants.rows.length; i++) {
        restaurants.rows[i].distance = `${Math.round(
          restaurants.rows[i].st_distance / 1000
        )} kms`;
        restaurants.rows[i].location = JSON.parse(restaurants.rows[i].location);
      }
      return response.json({ ...restaurants.toJSON(), status: "success" });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
  }

  /**
   * Render a form to be used for creating a new restaurant.
   * GET restaurants/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new restaurant.
   * POST restaurants
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single restaurant.
   * GET restaurants/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    try {
      const ip = request.ip();
      const geo = geoip.lookup(ip);
      console.log(geo);
      const longitude = (geo && geo.ll[1]) || 76.536949;
      const latitude = (geo && geo.ll[0]) || 9.01181;
      const restaurant = await Restaurant.query()
        .select(
          "id",
          "name",
          "slug",
          "description",
          "image",
          st.asGeoJSON("location"),
          st.distance(
            st.geography("location"),
            st.geography(st.geometry(`Point(${longitude} ${latitude})`, 4326))
          ),
          "address"
        )
        .where("id", params.id)
        .first();

      restaurant.distance = `${Math.round(restaurant.st_distance / 1000)} kms`;
      restaurant.location = JSON.parse(restaurant.location);

      const menus = await Menu.query()
        .where("restaurant_id", params.id)
        .distinct("menu_category_id")

        .fetch();
      console.log(menus.rows[0]);
      restaurant.menu_categories = [];
      try {
        for (let k = 0; k < menus.rows.length; k++) {
          restaurant.menu_categories[k] = await MenuCategory.find(
            menus.rows[k].menu_category_id
          );
        }
      } catch (err) {
        console.log(err);
      }
      restaurant.menu = await restaurant.menus().fetch();
      // console.log(restaurant.menu);
      for (let i = 0; i < restaurant.menu.rows.length; i++) {
        restaurant.menu.rows[i].menu_category = await restaurant.menu.rows[i]
          .category()
          .fetch();
        restaurant.menu.rows[i].menu_type = await restaurant.menu.rows[i]
          .type()
          .fetch();
      }
      return response.json({ data: restaurant.toJSON(), status: "success" });
    } catch (error) {
      console.log(error);
      if (error.name === "ModelNotFoundException")
        return response.status(404).json({ error: "Record not found!" });
      return response.status(500).json(error);
    }
  }

  /**
   * Render a form to update an existing restaurant.
   * GET restaurants/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update restaurant details.
   * PUT or PATCH restaurants/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a restaurant with id.
   * DELETE restaurants/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = RestaurantController;
