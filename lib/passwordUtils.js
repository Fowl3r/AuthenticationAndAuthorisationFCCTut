// using JS crypto library
const crypto = require("crypto");

// TODO

// password arg domes from user when they type into register form
function genPassword(password) {
	// salt: a pseudo random value, helps randomise the generation of the hash
	const salt = crypto.randomBytes(32).toString("hex");
	/*  pbkdf2 method in the crypto library, Sync for syncronos,
    hand it plain text password and salt, 
    10000 is how many iterations (minimum 1000, aim for 10,000,000 if performant),
    64 is how long the hash is going to be 'sha512' specifies which hashing function 
    we are using. .toString('hex) means turn to a hexadecimal string
    More info about hashing and crypto: https://www.rfc-editor.org/rfc/rfc8018#section-5.2
    */
	const genHash = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");

	return {
		salt: salt,
		hash: genHash,
	};
}

// basically the same as above but checking to see if the user salt is verified from db
// this one uses password the user just provided
function validPassword(password, hash, salt) {
	const hashVerify = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");

	// returns boolean, that we then put inside Passport JS verify callback
	return hash === hashVerify;
}
module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
