var assert    = require('chai').assert;
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080"
By = webdriver.By

test.describe('testing quantified-self-fe', function() {
  var driver;
  // this is set here for scope, so we have access to it later
  //this.timeout(10000)

  test.beforeEach(function() {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
  })

  test.afterEach(function() {
    driver.quit();
  })


  test.it("lists all foods", function() {
    driver.get("http://localhost:8080/foods.html")
    driver.findElement(By.id("food-table"))
    driver.sleep(300).then(function (){
      driver.findElement(By.id("food-table")).getText().then(function(foods){
        foods.includes("Pizza")
      })
    })
  })
})
