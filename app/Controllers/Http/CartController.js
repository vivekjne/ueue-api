"use strict";

const { validate } = use("Validator");
const Cart = use("App/Models/Cart");
const Restaurant = use("App/Models/Restaurant");

const MenuType = use("App/Models/MenuType");
const MenuCategory = use("App/Models/MenuCategory");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with carts
 */
class CartController {
  /**
   * Show a list of all carts.
   * GET carts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, request, response, view }) {
    const user = await auth.getUser();
    // console.log(user);
    try {
      const carts = await Cart.query()
        .where("user_id", user.id)

        .with("menu", (builder) => {
          builder.with("menuTypes").with("category");
        })
        .fetch();

      let restaurant = null;
      if (carts && Array.isArray(carts.rows) && carts.rows.length > 0) {
        restaurant = await Restaurant.find(carts.rows[0].restaurant_id);
      }

      // console.log(carts);
      return response.json({
        data: { carts_items: carts.toJSON(), restaurant },
        status: "success",
      });
    } catch (error) {
      console.log(error);
      return response.json({ error });
    }
  }

  /**
   * Render a form to be used for creating a new cart.
   * GET carts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new cart.
   * POST carts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    try {
      const rules = {
        menu_id: "required|number",
        restaurant_id: "required|number",
        qty: "required|number",
        price: "required|object",
      };

      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return validation.messages();
      }

      const body = request.body;

      if (
        !Object.keys(body.price).includes("title") &&
        !Object.keys(body.price).includes("price")
      ) {
        return response.json({ error: "price is invalid" });
      }
      const user = await auth.getUser();
      const oldCart = await Cart.query()
        .select("restaurant_id")
        .where("user_id", user.id)
        .first();
      if (oldCart && oldCart.restaurant_id !== body.restaurant_id) {
        return response.json({
          error: "You cannot add from another restaurant without removing cart",
        });
      }

      const itemExists = await Cart.query()
        .where({ user_id: user.id, menu_id: body.menu_id })
        .with("menu", (builder) => {
          builder.with("menuTypes").with("category");
        })
        .whereRaw("price->>'title'=? ", [body.price.title])

        .first();

      if (itemExists) {
        itemExists.qty = body.qty;
        itemExists.item_total = Number(itemExists.price.price) * itemExists.qty;
        await itemExists.save();

        return response.json({ data: itemExists.toJSON() });
      }

      body.item_total = body.price.price * body.qty;
      body.user_id = user.id;
      const cart = await Cart.create(body);
      await cart.load("menu", (builder) => {
        builder.with("menuTypes").with("category");
      });

      return response.json({ data: cart.toJSON(), status: "success" });
    } catch (error) {
      console.log(error);
      return response.json({ error });
    }
  }

  /**
   * Display a single cart.
   * GET carts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing cart.
   * GET carts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update cart details.
   * PUT or PATCH carts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const cart = await Cart.query()
        .where("id", params.id)
        .with("menu", (builder) => {
          builder.with("menuTypes").with("category");
        })
        .first();
      const rules = {
        qty: "required|number",
      };

      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return validation.messages();
      }

      const body = request.body;
      cart.qty = body.qty;
      cart.item_total = Number(cart.price.price) * cart.qty;
      await cart.save();
      return response.json({ data: cart.toJSON(), status: "success" });
    } catch (error) {
      return response.json({ error });
    }
  }

  /**
   * Delete a cart with id.
   * DELETE carts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const cart = await Cart.findOrFail(params.id);
      cart.delete();
      return response.json({ data: cart.toJSON(), status: "success" });
    } catch (error) {
      console.log(error);
      return response.json({ error });
    }
  }

  async clear({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const cart = await Cart.query().where("user_id", user.id).delete();

      return response.json({ data: [], status: "success" });
    } catch (error) {
      console.log(error);
      return response.json({ error });
    }
  }
}

module.exports = CartController;
