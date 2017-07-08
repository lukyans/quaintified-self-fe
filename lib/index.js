require("./main")
const Food = require("./foods")
const $ = require('jquery')

$(function() {
  // debugger;
  Food.createFoodsTable()
  .then(function(foodsHTML) {
    $('#food-table').html(foodsHTML)
  })
})
