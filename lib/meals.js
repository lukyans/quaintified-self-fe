var $ = require('jquery');
var host = require('./config').host
const Food = require("./foods")

function Meal(meal){
  this.id = meal.id;
  this.name = meal.name;
  this.created_at = meal.created_at
  this.foods = meal.foods;
}

Meal.getAllMeals = function(){
  return $.getJSON(`${host}/api/v1/meals`)
}

Meal.findMeal = function(id){
  return $.getJSON(`${host}/api/v1/meals/${id}`)
}

Meal.createMealTable = function(id){
<<<<<<< HEAD
  return this.findMeal(id)
=======
  return this.buildMealTable(this.findMeal(id))
}

Meal.buildMealTable = function(APIResponse){
  return APIResponse
>>>>>>> 6689d12aae05cf359f86e4ce1137c3ffd99b6f35
  .then(Meal.createFoodsObjects)
  .then(Meal.includeFoodsToMeals)
}

Meal.createFoodsObjects = function(meal){
   return meal.foods.map(function(food){
    return new Food(food)
  })
}

Meal.includeFoodsToMeals = function(foods){
return foods.map(function(food) {
  return food.mealFoodToHTML();
  })
}

module.exports = Meal
