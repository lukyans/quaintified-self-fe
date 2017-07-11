var assert    = require('chai').assert;
var $ = require('jquery');
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080"
By = webdriver.By

test.describe('testing quantified-self-fe', function() {
  var driver;

  this.timeout(10000)

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
  test.it("adds a new food", function(){
    driver.get(`${frontEndLocation}/foods.html`)

    driver.findElement({css: '#foodName input'}).sendKeys("New Food")
    driver.findElement({css: "#foodCalories input"}).sendKeys(987)
    driver.findElement({css: "input[type=submit]"})
    .click()

    driver.wait(until.elementLocated({css: "food-table"}))

    driver.findElement({css: "#food-table"}).getText().then(function(name){
      assert.include(name, "New Food")
    })
    driver.findElement({css: "#food-table"}).getText().then(function(data){
      assert.include(calories, 987)
    })
  })
})
