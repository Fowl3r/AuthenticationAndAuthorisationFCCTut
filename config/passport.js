/* 
Did not work when storing verifyCallback as a const with anon function,
believe this was done to allow for customFields - but these did not work either.
*/

const passport = require("passport");
const validPassword = require("../lib/passwordUtils").validPassword;
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
// Defined in database, User model Schema
const User = connection.models.User;

// define in customFields object so passportJS knows where to look
const customFields = {
	usernameField: "uname",
	passwordField: "pw",
};

/* 

What happens is we make a post request and we provide a JSON body with 'uname' & 'pw'
then passport as a middleware will look for these 2 fields then populate the parameters username & password with the value from the usernameField and passwordField
*/

/* must name username & password exactly these variables so that Passport local strategy
 can detect them, unless using custom Fields Object 
Here we are basically doing our own implementation of verification.
doesn't matter what db or method of verifying credentials
all that matters is the return values that are passed to done (callback) are what passport expects
*/
function verifyCallback(username, password, done) {
	// Below we are searching the mongoDB database 'User' and looking for a username that matches the one provided in the verifyCallback parameter
	User.findOne({ username: username })
		// user is returned in a basic promise
		.then(user => {
			console.log(user);
			// if no user in db , letting passport know that there isn't an error but there is no user matching in db
			if (!user) {
				return done(null, false);
			}

			// check if password is valid, putting password thorugh verification function and verifying hash and salt stored in db against the password
			const isValid = validPassword(password, user.hash, user.salt);
			// if credentials are valid return callback
			if (isValid) {
				// returns no error and user that has been verified, let us into route
				return done(null, user);
			} else {
				// no error but user not verified so do not let into route
				return done(null, false);
			}
		})
		// catch any errors that happen on express app or db, pass it to passport
		.catch(err => {
			done(err);
		});
}

// create new basic stratergy
const strategy = new LocalStrategy(verifyCallback);

// Pass in strategy below
passport.use(strategy);

// used for express session, this function when we use passport.authenticate()
// grabs user from db, gets id of it then inserts it into req.session.passport.user property
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// When we need to grab the user from the session we use this function
passport.deserializeUser((userId, done) => {
	// grabs user from database, then attatches found user to req.user object
	User.findById(userId)
		.then(user => {
			done(null, user);
		})
		.catch(err => done(err));
});
