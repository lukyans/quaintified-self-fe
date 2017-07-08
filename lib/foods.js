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
              <td class='food' contenteditable='true'>${this.name}</td>
              <td class='food-calories' contenteditable='true'>${this.calories}</td>
              <td class='food-remove'><button class='remove-food'>Remove</button></td>
          </tr>`
}

Food.prototype.createFood = function(){
  return $.post(`${host}/api/v1/foods`,
  {name: this.name, calories: this.calories})
  .then(function(foodObject){
    return new Food(foodObject)
  });
}


Food.prototype.editFoodName = function(id, newName){
  return $.ajax({
    url: `${host}/api/v1/foods/${id}`,
    method: 'PUT',
    dataType: 'json',
    data:{name: newName}
  })
}

Food.prototype.editFoodCalories = function(id, newCalories){
  return $.ajax({
    url: `${host}/api/v1/foods/${id}`,
    method: 'PUT',
    dataType: 'json',
    data:{calories: newCalories}
  })
}


Food.prototype.deleteFood = function(){
  return $.ajax({
    url: `${host}/api/v1/foods/${this.id}`,
    method: 'DELETE'
  })
}

Food.getAllFoods = function(){
  return $.getJSON(`${host}/api/v1/foods`)
}

Food.findFood = function(id){
  return $.getJSON(`${host}/api/v1/foods/${id}`)
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
