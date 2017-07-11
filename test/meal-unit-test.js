const Meal = require('../lib/meals')
const Food = require('../lib/foods')
const pry = require('pryjs')
const assert = require('chai').assert

describe('Meal', function(){
  it("builds a meal table", function(done){
    var APIResponse = new Promise (function(resolve){
        resolve({
          id: 1,
          name: "Breakfast",
          foods:[
            { id: 1, name: "yogurt", calories: 100 },
            { id: 2, name: "poptart", calories: 200 }
          ]
        })
        if(false)
          reject("nope")
    })

    Meal.buildMealTable(APIResponse)
    .then(function(mealHTML){
      assert(mealHTML.some(function(htmlRow){
        return htmlRow.includes("yogurt")
      }))
      done()
    })
  })

  it("creates food objects for a meal", function(done){
    this.timeout(100000)
    var meal = new Meal(
      { id: 1,
        name: "Breakfast",
        foods:[
           { id: 1, name: "yogurt", calories: 100 },
           { id: 2, name: "poptart", calories: 200 }
         ]
       }
    )
    var foodsArray = Meal.createFoodsObjects(meal)
      assert.equal(foodsArray.length, 2)
      done()
  })

  it("translates meal-foods to html", function(done){
    this.timeout(100000)
    var foods = [ new Food ({ id: 1, name: "yogurt", calories: 100 }),
                  new Food ({ id: 2, name: "poptart", calories: 200 } )
                ]

  var mealHTML = Meal.includeFoodsToMeals(foods)
    mealHTML.includes('yogurt')
    done()
  })
})
