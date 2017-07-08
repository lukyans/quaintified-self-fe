require("./main")
const Food = require("./foods")
const $ = require('jquery')

function getNewFood(){
  var name = $('#foodName input').val();
  var calories = $('#foodCalories input').val();

  return new Food({name: name, calories: calories})
}

$(function() {
  Food.createFoodsTable()
  .then(function(foodsHTML) {
    $('#food-table').html(foodsHTML)
  });

  $('input[type=submit]').on('click', function(){
    event.preventDefault();
    var newFood = getNewFood();
// debugger;
    newFood.createFood().then(function(completeFood){
      $("#food-table").append(completeFood.toHTML())
    });
  })


  $('#remove-food input[type="submit"]').on('click', function(){
    // var id =
  })
})
