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

Meal.prototype.findMeal = function(){
  return $.getJSON(`${host}/api/v1/meals/${this.id}`)
    .then(function(mealData){
      debugger
      new Meal(mealData)
    })
}

// Meal.find = function(id){
//   return this.id
// }


// everything BUT THE API
Meal.prototype.createMealTable = function(id){
  debugger
  return this.findMeal()
  .then(function(meal){
    return meal.createFoodsObjects()
  })
  .then(function(meal) {
    return meal.includeFoodsToMeals()
  })
}

Meal.prototype.createFoodsObjects = function(){
   this.foods = this.foods.map(function(food){
    return new Food(food)
  })
  return this;
}

Meal.prototype.includeFoodsToMeals = function(){
return this.foods.map(function(food) {
  return food.mealFoodToHTML();
  })
}

module.exports = Meal
