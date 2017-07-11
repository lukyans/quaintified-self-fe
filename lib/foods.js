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
              <td class='food' input type="text" contenteditable='true'>${this.name}</td>
              <td class='food-calories' input type="number" contenteditable='true'>${this.calories}</td>
              <td class='food-remove'><button class='remove-food'>Remove</button></td>
          </tr>`
}
Food.prototype.toHTMLWithCheckbox = function(){
  return `<tr data-id=${this.id}>
              <td class='checkbox'><input type="checkbox"></td>
              <td class='food' input type="text" contenteditable='true'>${this.name}</td>
              <td class='food-calories' input type="number" contenteditable='true'>${this.calories}</td>
          </tr>`
}
Food.prototype.mealFoodToHTML = function(food_id){
  return `<tr data-id=${food_id}>
              <td class='mealFood' input type="text" contenteditable='true'>${this.name}</td>
              <td class='mealFood-calories' input type="number" contenteditable='true'>${this.calories}</td>
              <td class='mealFood-remove'><button class='remove-mealFood'>Remove</button></td>
          </tr>`
}

Food.prototype.createFood = function(){
  return $.post(`${host}/api/v1/foods`,
  {name: this.name, calories: this.calories})
  .fail(function() {
    alert( "A food item needs a name and calories" )
  })
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

Food.createFoodTableWithCheckBox = function(){
  return this.getAllFoods()
  .then(function(foods){
    return foods.map(function(food){
      return new Food(food);
    })
  })
  .then(function(foods) {
    return foods.map(function(food) {
      return food.toHTMLWithCheckbox();
    })
  })
}

module.exports = Food
