const assert = require('chai').assert
const Meal = require('../../lib/meals')
const Food = require('../../lib/foods')
const pry = require("pryjs")

describe('Food', function() {
  it('can turn an API response into HTML', function(done) {
    var APIResponse = new Promise (function(resolve){
      resolve([{
        name: 'burrito',
        calories: 150
      },
      {
      name: 'salt',
      calories: 0
      }])
      if(false) reject("nope")
    })
    Food.buildFoodsTable(APIResponse)
    .then(function(foodHTML){
      assert(foodHTML.some(function(htmlRow){
        return htmlRow.includes("burrito")
      }))
      done()
    })
  })
})
