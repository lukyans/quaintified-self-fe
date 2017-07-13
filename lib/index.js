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
    })
    .then(function(data){
      Meal.createMealTable(meal_id)
      .then(function(mealHTML){
        $(`#meal-${meal_id}`).html(mealHTML)
      }).then(function(data){
        var cals;
        if(meal_id == 1){cals = 400}
        if(meal_id == 2){cals = 600}
        if(meal_id == 3){cals = 800}
        if(meal_id == 4){cals = 200}
        Meal.addCalorieRows(meal_id, cals, data)
      }).then(function(data){
        Meal.addCalorieData(data)
      }).then(function(data){
        var allButtons = document.getElementsByClassName("remove-mealFood")
        for(var i=0; i<allButtons.length; i++){
          allButtons[i].addEventListener('click', removeFoodFromMeal)
        }
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
  .then(function(data){
    Meal.createMealTable(meal_id)
    .then(function(mealHTML){
      $(`#meal-${meal_id}`).html(mealHTML)
    }).then(function(data){
      var cals;
      if(meal_id == 1){cals = 400}
      if(meal_id == 2){cals = 600}
      if(meal_id == 3){cals = 800}
      if(meal_id == 4){cals = 200}
      Meal.addCalorieRows(meal_id, cals, data)
    }).then(function(data){
      Meal.addCalorieData(data)
    }).then(function(data){
      var allButtons = document.getElementsByClassName("remove-mealFood")
      for(var i=0; i<allButtons.length; i++){
        allButtons[i].addEventListener('click', removeFoodFromMeal)
      }
    })
  })
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
  $('#filter-by-name').on('keyup', filterFoods)

  function filterFoods(){
    var filter = this.value.toUpperCase()
    var foods = document.getElementsByClassName('food')

    for(var i=0; i<foods.length; i++){
      var foodName = foods[i].innerHTML
      var matchedFilter = foodName.toUpperCase().indexOf(filter) > -1
      foods[i].parentElement.style.display = matchedFilter ? "" : "none"
    }
  }

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
    Meal.addCalorieRows(1, 400)
  }).then(function(data){
    Meal.addCalorieRows(2, 600)
  }).then(function(data){
    Meal.addCalorieRows(3, 800)
  }).then(function(data){
    Meal.addCalorieRows(4, 200)
  }).then(function(data){
    Meal.addCalorieData()
  })
// Meals Dropdown
  var mealOptions = document.getElementById('meal-drop-down')
  mealOptions.addEventListener('change', addFoodToMeal)
})
