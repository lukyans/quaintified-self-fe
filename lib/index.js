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
  Food.findFood(id).then(function(food){
    $.ajax({
      url: `http://localhost:3000/api/v1/foods/${food.id}`,
      type: 'DELETE'
    })
    $(`tr[data-id='${id}']`).html("")
  })
}

function editName(){
  var id = parseInt(this.parentElement.getAttribute("data-id"))
  var changedName = this.textContent
  Food.findFood(id).then(function(food){
    $.ajax({
      url: `http://localhost:3000/api/v1/foods/${food.id}`,
      type: 'PUT',
      data: {name: changedName}
    })
    $(`tr[data-id='${id}'].children[0]`).val(`${changedName}`);
  })
}
function editCalories(){
  var id = parseInt(this.parentElement.getAttribute("data-id"))
  var changedCals = this.textContent
  Food.findFood(id).then(function(food){
    $.ajax({
      url: `http://localhost:3000/api/v1/foods/${food.id}`,
      type: 'PUT',
      data: {calories: changedCals}
    })
    $(`tr[data-id='${id}'].children[1]`).val(`${changedCals}`);
  })
}

function addFoodToMeal(){
  var checkedBoxes = $('.checkbox').children('input:checked');
  var food_ids = []
  for(var i=0; i<checkedBoxes.length;i++){
    food_ids.push(parseInt(checkedBoxes[i].parentElement.parentElement.getAttribute('data-id')))
  }
  var meals = document.getElementById('meal-drop-down')
  var meal_id = parseInt(meals.options[meals.selectedIndex].value)
  food_ids.forEach(function(food_id){
    // debugger;
    $.ajax({
      url: `http://localhost:3000/api/v1/meals/${meal_id}?food_id=${food_id}`,
      type: 'POST',
      success: function(data) { console.log('Meal id: ' + meal_id) },
      error: function(data) {console.log('error')}
    })
  })
}

function removeFoodFromMeal(){
  mealTableId = this.parentElement.parentElement.id
  meal_id = parseInt(this.parentElement.parentElement.id.split('-')[1])
  food_id = parseInt(this.parentElement.getAttribute("data-id"))
  $.ajax({
    url: `http://localhost:3000/api/v1/meals/${meal_id}?food_id=${food_id}`,
    type: 'DELETE'
  })
  $(`#${mealTableId} tr[data-id='${food_id}']`).html("")
}

$(function() {
  // Manage Foods page
  Food.createFoodsTable()
  .then(function(foodsHTML) {
    $('#food-table').html(foodsHTML)
  }).then(function(data){
      var allButtons = document.getElementsByClassName("remove-food")

      for(var i=0; i<allButtons.length; i++){
        allButtons[i].addEventListener('click', removeFood)
      }
  }).then(function(data){
    var allNames = document.getElementsByClassName('food')
    for(var i=0; i<allNames.length; i++){
      allNames[i].addEventListener('blur', editName)
    }
  }).then(function(data){
    var allCals = document.getElementsByClassName('food-calories')
    for(var i=0; i<allCals.length; i++){
      allCals[i].addEventListener('blur', editCalories)
    }
  })

  $('input[type=submit]').on('click', function(){
    event.preventDefault();
    var newFood = getNewFood();
    newFood.createFood().then(function(completeFood){
      $("#food-table").append(completeFood.toHTML())
    })
    .then(function(data){
      var allButtons = document.getElementsByClassName("remove-food")
      for(var i=0; i<allButtons.length; i++){
        allButtons[i].addEventListener('click', removeFood)
      }
    })
  })

  // Diary Page
  Food.createFoodTableWithCheckBox()
  .then(function(foodsHTML){
    $('#food-table-with-checkbox').html(foodsHTML)
  })

  Meal.createMealTable(1)
  .then(function(mealHTML){
    $('#breakfast-1').html(mealHTML)
  })
  Meal.createMealTable(2)
  .then(function(mealHTML){
    $('#lunch-2').html(mealHTML)
  })
  Meal.createMealTable(3)
  .then(function(mealHTML){
    $('#dinner-3').html(mealHTML)
  })
  Meal.createMealTable(4)
  .then(function(mealHTML){
    $('#snack-4').html(mealHTML)
  }).then(function(data){
    var allButtons = document.getElementsByClassName("mealFood-remove")

    for(var i=0; i<allButtons.length; i++){
      allButtons[i].addEventListener('click', removeFoodFromMeal)
    }
  })
  var mealOptions = document.getElementById('meal-drop-down')
  mealOptions.addEventListener('change', addFoodToMeal, false)
})
