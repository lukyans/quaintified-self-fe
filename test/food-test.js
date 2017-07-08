var assert    = require('chai').assert;
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080"
// var pry = require('pryjs')
// at some point you will change to production and this allows you to easily change

test.describe('testing quantified-self-fe', function() {
  var driver;
  // this is set here for scope, so we have access to it later
  this.timeout(10000);

  test.beforeEach(function() {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
  })

  test.afterEach(function() {
    driver.quit();
  })


  test.it("lists all foods", function() {
  // $ajax(blah blah blach) and make sure what you get here is the info below in thetest...
  // this is a lazy test, to make it more robust make the ajax call and test the things
  driver.get(`${frontEndLocation}`)
  // the GIVEN
  driver.wait(until.elementLocated({css: "#food-table"}))
// the WHEN (something appears on the page)

// THEN there should be three things on the page (add more robust assertions here)
  driver.findElements({css: "#food-table"})
  .then(function (foods) {
    assert.lengthOf(foods, 6);
  })
})

})
