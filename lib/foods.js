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

Food.editFoodName = function(id, newName){
    $.ajax({
      url: `http://localhost:3000/api/v1/foods/${id}`,
      type: 'PUT',
      data: {name: newName}
    })
    $(`tr[data-id='${id}'].children[0]`).val(`${changedName}`);
}

Food.editFoodCalories = function(id, newCalories){
    $.ajax({
      url: `http://localhost:3000/api/v1/foods/${id}`,
      type: 'PUT',
      data: {calories: newCalories}
    })
    $(`tr[data-id='${id}'].children[1]`).val(`${changedCals}`);
}

Food.deleteFood = function(id){
  $.ajax({
    url: `http://localhost:3000/api/v1/foods/${id}`,
    type: 'DELETE'
  })
  $(`tr[data-id='${id}']`).html("")
}

Food.getAllFoods = function(){
  return $.getJSON(`${host}/api/v1/foods`)
}

Food.findFood = function(id){
  return $.getJSON(`${host}/api/v1/foods/${id}`)
}

Food.createFoodsTable = function(){
  return this.buildFoodsTable(this.getAllFoods())
}

Food.buildFoodsTable = function(APIResponse){
  return APIResponse
    .then(Food.createFoodsObjects)
    .then(Food.includeFoodsToTable)
  }

Food.createFoodsObjects = function(foods) {
    return foods.map(function(food){
      return new Food(food);
    })
}

Food.includeFoodsToTable = function(foods) {
  return foods.map(function(food) {
    return food.toHTML();
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
