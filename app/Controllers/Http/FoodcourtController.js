"use strict";

const Foodcourt = use("App/Models/Foodcourt");
const Database = use("Database");
const knexPostgis = require("knex-postgis");
const st = knexPostgis(Database);
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with foodcourts
 */
class FoodcourtController {
  /**
   * Show a list of all foodcourts.
   * GET foodcourts
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
      const foodcourts = await Foodcourt.query()
        .select(
          "id",
          "name",
          "slug",
          "description",
          st.asGeoJSON("location"),
          "address"
        )
        .paginate(page, limit);
      for (let i = 0; i < foodcourts.rows.length; i++) {
        foodcourts.rows[i].location = JSON.parse(foodcourts.rows[i].location);
      }
      return response.json({ ...foodcourts.toJSON(), status: "success" });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
  }

  /**
   * Render a form to be used for creating a new foodcourt.
   * GET foodcourts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new foodcourt.
   * POST foodcourts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single foodcourt.
   * GET foodcourts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    try {
      const foodcourt = await Foodcourt.findOrFail(params.id);
      return response.json({ data: foodcourt.toJSON(), status: "success" });
    } catch (error) {
      console.log(error);
      if (error.name === "ModelNotFoundException")
        return response.status(404).json({ error: "Record not found!" });
      return response.status(500).json(error);
    }
  }

  /**
   * Render a form to update an existing foodcourt.
   * GET foodcourts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update foodcourt details.
   * PUT or PATCH foodcourts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a foodcourt with id.
   * DELETE foodcourts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = FoodcourtController;
