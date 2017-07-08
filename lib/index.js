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
  // debugger;
  Food.findFood(id).then(function(food){
    $.ajax({
      url: `http://localhost:3000/api/v1/foods/${food.id}`,
      type: 'DELETE'
    })
    $(`tr[data-id='${id}']`).html("")
  })
}

function editFood(){

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
  })


  $('input[type=submit]').on('click', function(){
    event.preventDefault();
    var newFood = getNewFood();
    newFood.createFood().then(function(completeFood){
      $("#food-table").append(completeFood.toHTML())
    });
  })

// loop thru all the fields for name, loop thorugh all the fields for calories
// add the onblur listener,
  // add event lister with onblur, put request to the api
  // update the table on by resetting the value of the td to the changed value new input
})



  // $('#food-table').keypress(function(e){
  //   if(e.which == 13){
  //     if (.food){
  //       Food.updateName().then(function(data){
  //         $("food-table").change(data.toHTML)
  //       })
  //     }
  //   }
  //   Food.updateCalories();
  // })
  //
