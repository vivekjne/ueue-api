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
        username: "required|unique:users,username",
        email: "required|email|unique:users,email",
        password: "required|min:6|max:30",
      };

      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return validation.messages();
      }

      const userData = request.only(["username", "email", "password"]);
      userData.location = st.geomFromGeoJSON({
        type: "Point",
        coordinates: [-48.23456, 20.12345],
      });
      const user = await User.create(userData);
      const token = await auth.generate(user);
      //   const location = await st.asText(user.location);
      const sql2 = await Database.select(
        "id",
        "username",
        "email",
        st.asGeoJSON("location")
      )
        .from("users")
        .where("id", user.id)
        .first();

      sql2.location = JSON.parse(sql2.location);

      console.log(sql2);

      //   console.log({ user: st.asText(userOld.location) });
      return response.json({ token, user: sql2 });
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
        return validation.messages();
      }

      const { email, password } = request.all();
      const user = await auth.attempt(email, password);
      console.log(user);
      return user;
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async soicalLogin({ auth, request, response }) {
    try {
      const rules = {
        name: "required|accepted",
        username: "accepted",
        password: "accepted|min:6|max:30",
        provider: "required|in:email,google,facebook",
        providerKey: "accepted",
        userId: "accepted",
        photo: "accepted",
      };

      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return validation.messages();
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
