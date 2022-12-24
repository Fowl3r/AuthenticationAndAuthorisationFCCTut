// built in node js crypto library
const crypto = require("crypto");
//  built in node js file system so output keys in directory
const fs = require("fs");

function genKeyPair() {
	// Generates an object where the keys are stored in properties `privateKey` and `publicKey`
	// rsa standard algorithim to use.
	const keyPair = crypto.generateKeyPairSync("rsa", {
		modulusLength: 4096, // bits - standard for RSA keys
		publicKeyEncoding: {
			type: "pkcs1", // Public Key Cryptography Standars 1
			format: "pem", // Most Common formatting choice
		},
		privateKeyEncoding: {
			type: "pkcs1", // Public key Cryptography Standards 1
			format: "pem", // Most common formatting choice
		},
	});

	// Create the public key
	fs.writeFileSync(__dirname + "/id_rsa_pub.pem", keyPair.publicKey);

	// Create the private key file
	fs.writeFileSync(__dirname + "/id_rsa_priv.pem", keyPair.privateKey);
}

// Generates the key pair
genKeyPair();
