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
  return this.buildMealTable(this.findMeal(id))
}

Meal.buildMealTable = function(APIResponse){
  return APIResponse
  .then(Meal.createFoodsObjects)
  .then(Meal.includeFoodsToMeals)
}

Meal.createFoodsObjects = function(meal){
   return meal.foods.map(function(food){
    return new Food(food)
  })
}

Meal.includeFoodsToMeals = function(foods){
return foods.map(function(food) {
  return food.mealFoodToHTML();
  })
}

Meal.addCalorieRows = function(){
  $('<tr><td><b>Total Calories</b></td><td colspan="2" id="breakfast-total"><b>400<b></td></tr>').appendTo("#meal-1")
  $('<tr><td><b>Remaining Calories</b></td><td colspan="2" id="breakfast-remaining"></td></tr>').appendTo("#meal-1")
  $('<tr><<td><b>Total Calories</b></td><td colspan="2" id="lunch-total"><b>600</b></td></tr>').appendTo("#meal-2")
  $('<tr><td><b>Remaining Calories</b></td><td colspan="2" id="lunch-remaining"></td></tr>').appendTo("#meal-2")
  $('<tr><td><b>Total Calories</b></td><td colspan="2" id="dinner-total"><b>800</b></td></tr>').appendTo("#meal-3")
  $('<tr><td><b>Remaining Calories</b></td><td colspan="2" id="dinner-remaining"></td></tr>').appendTo("#meal-3")
  $('<tr><td><b>Total Calories</b></td><td colspan="2" id="snack-total"><b>200</b></td></tr>').appendTo("#meal-4")
  $('<tr><td><b>Remaining Calories</b></td><td colspan="2" id="snack-remaining"></td></tr>').appendTo("#meal-4")
}

Meal.addCalorieData = function(){
  const mealsCalories = { "breakfast" :{index: 1, calories: 400},
                          "lunch" :{index: 2, calories: 460},
                          "dinner" :{index: 3, calories: 800},
                          "snack" :{index: 4, calories: 200},
                        }
  Object.keys(mealsCalories).forEach(function (meal){
    var {index, calories} = mealsCalories[meal]
    var consumed = 0
    var cals = document.getElementById(`meal-${index}`).children
    for(var i=0; i<(cals.length-2); i++){
      consumed += parseInt(cals[i].children[1].innerHTML)
    }
    $(`#${meal}-total`).html(`${consumed} of ${calories}`)
    $(`#${meal}-remaining`).html(`${calories-consumed}`)

    var count = $(`#${meal}-remaining`)[0].innerHTML
    var colorClass = count.includes('-') ? "negative" : "positive"
    $(`#${meal}-remaining`).addClass(colorClass)
  })

  // Total Calories Table
  var totalConsumed = 0
  var allCalories = document.getElementsByClassName("mealFood-calories")
  for(var i=0; i<allCalories.length; i++){
   totalConsumed += parseInt(allCalories[i].innerHTML)
  }
  $('#consumed-num').html(`${totalConsumed}`)
  $('#remaining-num').html(`${2000 -totalConsumed}`)
  var calCount = $('#remaining-num').text()

  if (calCount.includes('-')){
    $("#remaining-num").addClass("negative")
  } else{
    $("#remaining-num").addClass("positive")
  }
}
module.exports = Meal
