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

  function sort(){
    var sortingOptions = document.getElementById('filter-drop-down')
    var sortBy = sortingOptions.options[sortingOptions.selectedIndex].innerHTML

    // Food.create the foods table by asc or desc cals/created_at
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
    // Meals Dropdown
      var sortingOptions = document.getElementById('filter-drop-down')
      sortingOptions.addEventListener('change', sort)

  })

  // -----Diary Page------
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
  //  Calorie Data on Meal Tables
    $('<tr><td><b>Total Calories</b></td><td colspan="2" id="breakfast-total"><b>400<b></td></tr>').appendTo("#meal-1")
    $('<tr><td><b>Remaining Calories</b></td><td colspan="2" id="breakfast-remaining"></td></tr>').appendTo("#meal-1")
    $('<tr><<td><b>Total Calories</b></td><td colspan="2" id="lunch-total"><b>600</b></td></tr>').appendTo("#meal-2")
    $('<tr><td><b>Remaining Calories</b></td><td colspan="2" id="lunch-remaining"></td></tr>').appendTo("#meal-2")
    $('<tr><td><b>Total Calories</b></td><td colspan="2" id="dinner-total"><b>800</b></td></tr>').appendTo("#meal-3")
    $('<tr><td><b>Remaining Calories</b></td><td colspan="2" id="dinner-remaining"></td></tr>').appendTo("#meal-3")
    $('<tr><td><b>Total Calories</b></td><td colspan="2" id="snack-total"><b>200</b></td></tr>').appendTo("#meal-4")
    $('<tr><td><b>Remaining Calories</b></td><td colspan="2" id="snack-remaining"></td></tr>').appendTo("#meal-4")
  }).then(function(data){

    // Breakfast Caloires
    var breakfastConsumed = 0
    var breakfastCals = document.getElementById('meal-1').children
    for(var i=0; i<(breakfastCals.length-2); i++){
      breakfastConsumed += parseInt(breakfastCals[i].children[1].innerHTML)
    }
    $("#breakfast-total").html(`${breakfastConsumed} of 400`)
    $("#breakfast-remaining").html(`${400-breakfastConsumed}`)

    var bCount = $('#breakfast-remaining')[0].innerHTML
    if (bCount.includes('-')){
      $("#breakfast-remaining").addClass("negative")
    } else {
      $("#breakfast-remaining").addClass("positive")
    }
  // Lunch Calories
    var lunchConsumed = 0
    var lunchCals = document.getElementById('meal-2').children
    for(var i=0; i<(lunchCals.length-2); i++){
      lunchConsumed += parseInt(lunchCals[i].children[1].innerHTML)
    }
    $("#lunch-total").html(`${lunchConsumed} of 600`)
    $("#lunch-remaining").html(`${600-lunchConsumed}`)

    var lCount = $('#lunch-remaining')[0].innerHTML
    if (lCount.includes('-')){
      $("#lunch-remaining").addClass("negative")
    } else {
      $("#lunch-remaining").addClass("positive")
    }
    // Dinner Calories
    var dinnerConsumed = 0
    var dinnerCals = document.getElementById('meal-3').children
    for(var i=0; i<(dinnerCals.length-2); i++){
      dinnerConsumed += parseInt(dinnerCals[i].children[1].innerHTML)
    }
    $("#dinner-total").html(`${dinnerConsumed} of 800`)
    $("#dinner-remaining").html(`${800-dinnerConsumed}`)

    var dCount = $('#dinner-remaining')[0].innerHTML
    if (dCount.includes('-')){
      $("#dinner-remaining").addClass("negative")
    } else {
      $("#dinner-remaining").addClass("positive")
    }

  // Snack Calories
    var snackConsumed = 0
    var snackCals = document.getElementById('meal-4').children
    for(var i=0; i<(snackCals.length-2); i++){
      snackConsumed += parseInt(snackCals[i].children[1].innerHTML)
    }
    $("#snack-total").html(`${snackConsumed} of 200`)
    $("#snack-remaining").html(`${200-snackConsumed}`)

    var sCount = $('#snack-remaining')[0].innerHTML
    if (sCount.includes('-')){
      $("#snack-remaining").addClass("negative")
    } else {
      $("#snack-remaining").addClass("positive")
    }

    // Total Calories Table
    var totalConsumed = 0
    var allCalories = document.getElementsByClassName("mealFood-calories")
    for(var i=0; i<allCalories.length; i++){
     totalConsumed += parseInt(allCalories[i].innerHTML)
    }
    $('#consumed-num').html(`${totalConsumed}`)
    $('#remaining-num').html(`${3000 -totalConsumed}`)
    var calCount = $('#remaining-num').text()

    if (calCount.includes('-')){
      $("#remaining-num").addClass("negative")
    } else{
      $("#remaining-num").addClass("positive")
    }

  })
// Meals Dropdown
  var mealOptions = document.getElementById('meal-drop-down')
  mealOptions.addEventListener('change', addFoodToMeal)
})
