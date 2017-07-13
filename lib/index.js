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

//Food sorter
var sort = document.getElementById("sort-drop-down")
sort.addEventListener("change", sortFoodTable)

function sortFoodTable(){
  var sorters = $('#sort-drop-down').children()
  for(var i=0; i<sorters.length; i++){
    if (sorters[i].selected) {
      someSortingMethod(sorters[i].value)
    }
  }
}
  function someSortingMethod(num){
    if (num == 1) {
    return sortByName()
  }
  else if (num == 2) {
    return sortByMostCalories()
  }
  else {
    return sortByLeastCalories()
  }
}

function sortByName(){
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("food-table")
  switching = true;
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("TR")
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch= true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
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

// Meal Table Calories
    const mealsCalories = { "breakfast" :{index: 1, calories: 400},
                            "lunch" :{index: 2, calories: 460},
                            "dinner" :{index: 3, calories: 800},
                            "snack" :{index: 4, calories: 200},
                          }
    Object.keys(mealsCalories).forEach(function (meal){
      var {index, calories} = mealsCalories[meal]
      var consumed = 0
      //debugger
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
  })
// Meals Dropdown
  var mealOptions = document.getElementById('meal-drop-down')
   mealOptions.addEventListener("change", addFoodToMeal)
})

// // sort foods list
// var sortingOptions = document.getElementById('filter-drop-down')
// sortingOptions.addEventListener('change', sort)
