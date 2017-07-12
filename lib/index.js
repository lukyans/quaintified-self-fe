require("./main")
var host = require('./config').host
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
  // debugger
  Food.editFoodCalories(id, changedCals)
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
    $.ajax({
      url: `${host}/api/v1/meals/${meal_id}?food_id=${food_id}`,
      type: 'POST',
      success: function(data) { },
      error: function(data) {console.log('error')}
    }).then(function(data){
      Meal.createMealTable(meal_id)
      .then(function(mealHTML){
        $(`#meal-${meal_id}`).html(mealHTML)
      })
    })
  })
}

function removeFoodFromMeal(){
  var mealTableId = this.parentElement.parentElement.parentElement.id
  var meal_id = parseInt(this.parentElement.parentElement.parentElement.id.split('-')[1])
  var food_id = parseInt(this.parentElement.parentElement.getAttribute('data-id'))
  $.ajax({
    url: `${host}/api/v1/meals/${meal_id}?food_id=${food_id}`,
    type: 'DELETE'
  })
  $(`#${mealTableId} tr[data-id='${food_id}']`).html("")
}

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

// Food.editCalorieButtons = function() {
//   var allCals = document.getElementsByClassName('food-calories')
//   for(var i=0; i<allCals.length; i++){
//     allCals[i].addEventListener('blur', editCalories)
//   }
// }

$(function() {
  Food.createFoodsTable()
  .then(function(foodsHTML) {
    $('#food-table').html(foodsHTML)
  }).then(function(data){
    Food.deleteButtons(data)
  }).then(function(data){
    Food.editNameButtons(data)
  }).then(function(data){
    var allCals = document.getElementsByClassName('food-calories')
    for(var i=0; i<allCals.length; i++){
      allCals[i].addEventListener('blur', editCalories)
    }
    //Food.editCaloriesButtons(data)
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
    $('#meal-1').html(mealHTML)
  })
  Meal.createMealTable(2)
  .then(function(mealHTML){
    $('#meal-2').html(mealHTML)
  })
  Meal.createMealTable(3)
  .then(function(mealHTML){
    $('#meal-3').html(mealHTML)
  })
  Meal.createMealTable(4)
  .then(function(mealHTML){
    $('#meal-4').html(mealHTML)
  }).then(function(data){
    var allButtons = document.getElementsByClassName("remove-mealFood")
    for(var i=0; i<allButtons.length; i++){
      allButtons[i].addEventListener('click', removeFoodFromMeal)
    }
  }).then(function(data){
    var totalConsumed = 0
    var allCalories = document.getElementsByClassName("mealFood-calories")
    for(var i=0; i<allCalories.length; i++){
     totalConsumed += parseInt(allCalories[i].innerHTML)
    }

    // Total Calories Table
    $('#consumed-num').html(`${totalConsumed}`)
    $('#remaining-num').html(`${3000 -totalConsumed}`)
    var calCount = $('#remaining-num').text()

    if (calCount.includes('-')){
      $("#remaining-num").addClass("negative")
    }
  })

  // Calories on a table
  // $('<tr><td>Total Calories</td><td id="breakfast-total">9876</td></tr>').appendTo("#meal-1")

// Meals Dropdown
  var mealOptions = document.getElementById('meal-drop-down')
  mealOptions.addEventListener('change', addFoodToMeal)
})
