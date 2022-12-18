const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
// https://www.passportjs.org/howtos/password/ docs for passport
const passport = require("passport");
// nodeJS crypto library
const crypto = require("crypto");
const routes = require("./routes");
const connection = require("./config/database");

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require("connect-mongo")(session);

// Need to require the entire Passport config module so app.js knows about it
// takes passport.use(stratergy) from passport.js and includes it in app.js
require("./config/passport");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Create the Express application
var app = express();

// middleware for parsing http responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

/* 
Express session gives access to the request.session object
 and anything that is stored on this object
in any of the routes will be persisted to the database under the sessions collection.
Knowing this passport recognises this and uses it as a user authentication 
*/

const sessionStore = new MongoStore({
	mongooseConnection: connection,
	collection: "session",
});

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			// Math for a day
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
require("./config/passport");
/* Every time route is loaded these 2 middlewares work together
check if passport.user is != to null, then knows there is a logged in user
grabs the user id from passport.user property then uses deserialiseUser method pass in user ID and grab that from database, then populate req.user to what was grabbed from the db - happens every route request */
// initialiase & refresh passport middleware for each route
app.use(passport.initialize());
// express session middleware
app.use(passport.session());

app.use((req, res, next) => {
	// express session creates this object
	console.log(req.session);
	// passport middleware creates this object
	console.log(req.user);
	next();
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);
