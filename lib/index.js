require("./main")
const Food = require("./foods")
const Meal = require("./meals")
const $ = require('jquery')

function getNewFood(){
  var name = $('#foodName input').val();
  var calories = $('#foodCalories input').val();
  return new Food({name: name, calories: calories})
}

function removeFood() {
  var id = parseInt(this.parentElement.parentElement.getAttribute("data-id"))
  Food.deleteFood(id)
}

function editName(){
  var id = parseInt(this.parentElement.getAttribute("data-id"))
  var changedName = this.textContent
  Food.editFoodName(id, changedName)
 }

function editCalories(){
  var id = parseInt(this.parentElement.getAttribute("data-id"))
  var changedCals = this.textContent
  Food.editFoodCalories(id, changedCals)
}

$(function() {
  Food.createFoodsTable()
  .then(function(foodsHTML) {
    $('#food-table').html(foodsHTML)
  }).then(function(data){
    Food.deleteButtons(data)
  }).then(function(data){
    Food.editNameButtons(data)
  }).then(function(data){
    Food.editCalorieButtons(data)
  })

Food.deleteButtons = function(){
  var allButtons = document.getElementsByClassName("remove-food")
  for(var i=0; i<allButtons.length; i++){
    allButtons[i].addEventListener('click', removeFood)
  }
}

Food.editNameButtons = function(){
  var allNames = document.getElementsByClassName('food')
  for(var i=0; i<allNames.length; i++){
    allNames[i].addEventListener('blur', editName)
  }
}

Food.editCalorieButtons = function() {
  var allCals = document.getElementsByClassName('food-calories')
  for(var i=0; i<allCals.length; i++){
    allCals[i].addEventListener('blur', editCalories)
  }
}

  Meal.createMealTable(1)
  .then(function(mealHTML){
    $('#breakfast').html(mealHTML)
  })
  Meal.createMealTable(2)
  .then(function(mealHTML){
    $('#lunch').html(mealHTML)
  })
  Meal.createMealTable(3)
  .then(function(mealHTML){
    $('#dinner').html(mealHTML)
  })
  Meal.createMealTable(4)
  .then(function(mealHTML){
    $('#snack').html(mealHTML)
  })


  $('input[type=submit]').on('click', function(){
    event.preventDefault();
    var newFood = getNewFood();
    newFood.createFood().then(function(completeFood){
      $("#food-table").append(completeFood.toHTML())
    })
    .then(function(data){
        Meal.deleteButtons(data)
    })
  })
})

Meal.deleteButtons = function(){
  var allButtons = document.getElementsByClassName("remove-food")
  for(var i=0; i<allButtons.length; i++){
    allButtons[i].addEventListener('click', removeFood)
  }
}
