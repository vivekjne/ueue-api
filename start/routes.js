"use strict";

const FoodcourtController = require("../app/Controllers/Http/FoodcourtController");

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.resource("categories", "CategoryController").middleware(
  new Map([[["store", "update", "destroy"], ["auth:jwt"]]])
);

// Foodcourt routes
Route.resource("foodcourts", "FoodcourtController").middleware(
  new Map([[["store", "update", "destroy"], ["auth:jwt"]]])
);

// Restaurant routes
Route.resource("restaurants", "RestaurantController").middleware(
  new Map([[["store", "update", "destroy"], ["auth:jwt"]]])
);

// Cart routes
Route.resource("carts", "CartController").middleware(["auth:jwt"]);
// Auth routes
Route.post("auth/register", "UserController.register");
Route.post("auth/login", "UserController.login");
Route.post("auth/social", "UserController.soicalLogin");
