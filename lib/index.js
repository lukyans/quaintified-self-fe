require("./main")
const Food = require("./foods")
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
  // debugger;
  var changedName = this.textContent
// debugger;
  Food.findFood(id).then(function(food){
    $.ajax({
      url: `http://localhost:3000/api/v1/foods/${food.id}`,
      type: 'PUT',
      data: {name: changedName}
    })
    $(`tr[data-id='${id}'].children[0]`).val(`${changedName}`);
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


})
