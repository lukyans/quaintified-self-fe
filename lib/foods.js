var $ = require('jquery');
var host = require('./config').host

function Food(food){
  this.id = food.id;
  this.name = food.name;
  this.calories = food.calories;
  this.created_at = food.created_at
}

Food.prototype.toHTML = function(){
  return `<tr data-id=${this.id}>
              <td class='food'>${this.name}</td>
              <td class='food-calories'>${this.calories}</td>
              <td class='food-remove'><button id='remove-food'>Remove</button></td>
          </tr>`
}

Food.getAllFoods = function(){
  return $.getJSON(`${host}/api/v1/foods`)
}

Food.createFoodsTable = function(){
  return this.getAllFoods()
  .then(function(foods){
    return foods.map(function(food){
      return new Food(food);
    })
  })
  .then(function(foods) {
    return foods.map(function(food) {
      return food.toHTML();
    })
  })
}

module.exports = Food
