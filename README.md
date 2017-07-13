Quantified Self

Team Members: Stephanie Bentley and Sergey Lukyanenko

The app is a two-page, front-end application that tracks calories and stores food items.
Backend available at:

Hosted on github pages at: https://lukyans.github.io/quantified-self-fe/foods.html

The backend application can be visited live at: https://quantified-self-1701.herokuapp.com/
To see more information regarding the available endpoints visit the github repo: https://github.com/slague/quantified-self



To install/run locally:

Clone front-end AND back-end down:

# clone front end
$ git clone git@github.com:lukyans/quantified-self-fe.git

# clone back-end
$ git clone git@github.com:slague/quantified-self.git
Set up the repo, start localhost:

# set up backend app
$ cd quantified-self
$ npm install
$ knex migrate:latest
$ knex seed:run
$ npm start

# cd into front-end, install modules, start server
$ cd quantified-self-fe
$ npm install
$ npm start
Open up on localhost:

http://localhost:8080/webpack-dev-server/
