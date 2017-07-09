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

$(function() {
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
        var allButtons = document.getElementsByClassName("remove-food")
        for(var i=0; i<allButtons.length; i++){
          allButtons[i].addEventListener('click', removeFood)
        }
    // }).then(function(data){
    //   var allCals = document.getElementsByClassName('food-calories')
    //   for(var i=0; i<allCals.length; i++){
    //     allCals[i].addEventListener('blur', editCalories)
    //   }
    // })
    })
  })
  // var length = $("#food-table").children.length) - 1
  // $("#food-table").children[length].children[2].children[0]
  // $('#food-table').children[2].children[0].addEventListener('click', removeFood)

})
