const assert = require('chai').assert
const Food = require(../lib/foods.js)

describe('Food', function() {
  it('can turn an API response into HTML', function() {
    var APIresponse = new Promise(function(resolve){
      resolve({
        name: 'buritto',
        calories: 150
      })
      if(false) reject("nope")
    })
    Food.
  })
})

// describe('Meal', function() {
//   it('can turn an API response into HTML', function() {
//     var APIresponse = new Promise(function(resolve){
//     resolve({
//       name: "Breakfast",
//       caloric_goal: 200,
//       foods: [
//         {
//           name: "Banana",
//           calories: 35
//         }
//       ]
//     })
//     if(false) reject("nope")
//   })
//     Meal.fromAPIToHTML(APIresponse)
//     .then(fuction(mealHTML){
//       assert.include(mealHTML, "Banana")
//         done()
//     }
//
//   })
// })
