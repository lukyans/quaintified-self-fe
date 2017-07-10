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
  return this.findMeal(id)
  .then(function(meal){
    var foods = meal.foods
    return foods.map(function(food){
      return new Food(food);
    })
  })
  .then(function(foods) {
    return foods.map(function(food) {
      return food.mealFoodToHTML();
    })
  })
}

module.exports = Meal
