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

Meal.addCalorieRows = function(meal_id, cals){
  $(`<tr><td><b>Total Calories</b></td><td colspan="2" id="${meal_id}-total"><b>${cals}<b></td></tr>`).appendTo(`#meal-${meal_id}`)
  $(`<tr><td><b>Remaining Calories</b></td><td colspan="2" id="${meal_id}-remaining"></td></tr>`).appendTo(`#meal-${meal_id}`)
}

Meal.addCalorieData = function(){
  const mealsCalories = { "breakfast" :{index: 1, calories: 400},
                          "lunch" :{index: 2, calories: 600},
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
    $(`#${index}-total`).html(`${consumed} of ${calories}`)
    $(`#${index}-remaining`).html(`${calories-consumed}`)

    var count = $(`#${index}-remaining`)[0].innerHTML
    var colorClass = count.includes('-') ? "negative" : "positive"
    $(`#${index}-remaining`).addClass(colorClass)
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
