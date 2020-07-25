"use strict";
const User = use("App/Models/User");
const { validate } = use("Validator");
const Database = use("Database");
const knexPostgis = require("knex-postgis");
const st = knexPostgis(Database);

class UserController {
  /**
   * Create/save a new User.
   * POST register
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async register({ auth, request, response }) {
    try {
      const rules = {
        name: "required",

        email: "required|email|unique:users,email",
        password: "required|min:6|max:30",
      };

      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return response.status(422).json(validation.messages());
      }

      const userData = request.only(["name", "email", "password"]);
      // userData.location = st.geomFromGeoJSON({
      //   type: "Point",
      //   coordinates: [-48.23456, 20.12345],
      // });
      userData.provider = "email";
      const user = await User.create(userData);
      const token = await auth.generate(user);
      //   const location = await st.asText(user.location);
      // const sql2 = await Database.select(
      //   "id",
      //   "username",
      //   "email",
      //   st.asGeoJSON("location")
      // )
      //   .from("users")
      //   .where("id", user.id)
      //   .first();

      // sql2.location = JSON.parse(sql2.location);

      // console.log(sql2);

      //   console.log({ user: st.asText(userOld.location) });
      return response.json({ ...token, status: "success" });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  /**
   * Create/save a new User.
   * POST register
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async login({ auth, request, response }) {
    try {
      const rules = {
        email: "required|email",
        password: "required|min:6|max:30",
      };

      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return response.status(422).json(validation.messages());
      }

      const { email, password } = request.all();
      const user = await auth.attempt(email, password);
      // console.log(user);
      return response.json({ ...user, status: "success" });
    } catch (error) {
      console.log(error);
      if (error.name === "UserNotFoundException") {
        return response
          .status(404)
          .json({ error: { message: error.message, name: error.name } });
      }
      return response.status(500).json({ error: error });
    }
  }

  async soicalLogin({ auth, request, response }) {
    try {
      const rules = {
        name: "required|accepted",

        password: "accepted|min:6|max:30",
        email: "accepted|email",
        provider: "required|in:email,google,facebook",
        providerKey: "accepted",
        userId: "accepted",
        photo: "accepted",
      };

      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return response.status(422).json(validation.messages());
      }

      const userData = request.body;
      const user = await User.create(userData);
      const token = await auth.generate(user);
      return response.json({ token });
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

module.exports = UserController;
