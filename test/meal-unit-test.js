const assert = require('chai').assert

describe('Meal' function(){
  // it("can turn an api resoinse into HTML", function(done){
  //   // mocking an api resonse
  //   var APIResponse = new Promise (function(resolve){
  //     resolve({
  //     name: 'breakfast',
  //     foods: [
  //       { name: "hotdog", calories: 100},
  //       { name: "yogurt", calories: 50 }
  //       ]
  //     })
  //     if(false)
  //       reject("nope")
  //   })
  //
  //   Meal.fromAPIToHTML(APIResponse)
  //   .then(function(mealHTML){
  //     assert(mealHTML.some(function(htmlRow){
  //       return htmlRow.includes("hotdog")
  //     }))
  //     done()
  //   })
  // })

  it("builds a meal table", function(){

    Meal.findMeal(1) = function(){
      return new Promise(function(resolve, reject){
        resolve(new Meal({
          id: 1,
          name: "Breakfast",
          foods:[
            { id: 1, name: "yogurt", calories: 100 },
            { id: 2, name: "poptart", calories: 200 }
          ]
        }))
      })
    }

    Meal.createMealTable().then(function(html){
      assert.html.includes("yogurt")
    })
    done()
  })
})


// what goes in? What comes?
