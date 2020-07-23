"use strict";
const { validate } = use("Validator");
const Category = use("App/Models/Category");
const Helpers = use("Helpers");
const slugify = require("slugify");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const categories = await Category.all();
    return categories.toJSON();
  }

  /**
   * Render a form to be used for creating a new category.
   * GET categories/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const rules = {
      name: "required|unique:categories,name",
      description: "required",
      slug: "min:2",
      parent: "accepted",
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return validation.messages();
    }

    const category = new Category();

    category.name = request.input("name");
    category.description = request.input("description");

    category.slug = slugify(category.name);
    if (request.input("parent")) {
      const parentCategory = await Category.findOrFail(request.input("parent"));
      category.parent = request.input("parent");
    }

    const categoryImage = request.file("image", {
      types: ["image"],
      size: "2mb",
    });
    const fileName = `${Date.now()}.${categoryImage.extname}`;
    await categoryImage.move(Helpers.publicPath("uploads/category"), {
      name: fileName,
    });

    if (!categoryImage.moved()) {
      return categoryImage.error();
    }

    category.image = fileName;

    await category.save();

    return response.json({ data: category.toJSON() });
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    try {
      const category = await Category.findOrFail(params.id);

      return category.toJSON();
    } catch (err) {
      console.log(err.message);
      if (err.name === "ModelNotFoundException")
        return response.status(404).json({ error: "Record not found!" });
    }
  }

  /**
   * Render a form to update an existing category.
   * GET categories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const rules = {
        name: "accepted",
        description: "accepted",
        slug: "accepted",
      };

      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return validation.messages();
      }

      const category = await Category.findOrFail(params.id);
      const nameExists = await Category.findBy("name", request.input("name"));

      if (nameExists && nameExists.id !== category.id) {
        return response.status(400).json({ error: "" });
      }

      if (request.input("name")) {
        category.name = request.input("name");
      }

      if (request.input("description")) {
        category.description = request.input("description");
      }

      if (request.input("slug")) {
        category.slug = request.input("slug");
      } else {
        category.slug = slugify(category.name);
      }

      if (request.input("parent")) {
        const parentCategory = await Category.findOrFail(
          request.input("parent")
        );
        category.parent = request.input("parent");
      }

      const categoryImage = request.file("image", {
        types: ["image"],
        size: "2mb",
      });
      if (categoryImage) {
        const fileName = `${Date.now()}.${categoryImage.extname}`;
        await categoryImage.move(Helpers.publicPath("uploads/category"), {
          name: fileName,
        });

        if (!categoryImage.moved()) {
          return categoryImage.error();
        }

        category.image = fileName;
      }

      await category.save();
      return category.toJSON();
    } catch (err) {
      console.log(err.message);
      if (err.name === "ModelNotFoundException")
        return response.status(404).json({ error: "Record not found!" });

      return response.status(500).json({ error: err.message });
    }
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const category = await Category.findOrFail(params.id);
      category.delete();
      return response.json({
        message: `${category.name} deleted successfully`,
        status: 200,
      });
    } catch (err) {
      console.log(err.message);
      if (err.name === "ModelNotFoundException")
        return response.status(404).json({ error: "Record not found!" });
      return response.status(500).json({ error: err.message });
    }
  }
}

module.exports = CategoryController;
