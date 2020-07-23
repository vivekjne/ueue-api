"use strict";
const Restaurant = use("App/Models/Restaurant");
const Database = use("Database");
const knexPostgis = require("knex-postgis");
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
      const restaurants = await Restaurant.query()
        .select(
          "id",
          "name",
          "slug",
          "description",
          st.asGeoJSON("location"),
          st.distance(
            st.geography("location"),
            st.geography(st.geometry("Point(76.536949 9.011810)", 4326))
          ),
          "address"
        )
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
      const restaurant = await Restaurant.query()
        .select(
          "id",
          "name",
          "slug",
          "description",
          st.asGeoJSON("location"),
          st.distance(
            st.geography("location"),
            st.geography(st.geometry("Point(76.536949 9.011810)", 4326))
          ),
          "address"
        )
        .where("id", params.id)
        .first();

      restaurant.distance = `${Math.round(restaurant.st_distance / 1000)} kms`;
      restaurant.location = JSON.parse(restaurant.location);

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
