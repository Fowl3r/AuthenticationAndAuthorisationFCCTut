const crypto = require("crypto");
const fs = require("fs");
const decrypt = require("./decrypt");

// This is the data that we are receiving from the sender
const recievedData = require("./signMessage").packageOfDataToSend;

// built in node hash from crypto library, .algorithm is from
const hash = crypto.createHash(recievedData.algorithm);

// public key of sender
const publicKey = fs.readFileSync(__dirname + "/id_rsa_pub.pem", "utf8");

// take data that is signed and decrypted. Simply gives hash value to verify take our own hash provided in myData object and compare hashes, should match and we can now data was not tampered with and was signed by who said they signed it
const decryptedMessage = decrypt.decryptWithPublicKey(
	publicKey,
	recievedData.signedAndEncryptedData
);

// Turn decrypted message into string to pass into funciton
const decryptedMessageHex = decryptedMessage.toString();

// Takes has of data passed to us in data package and the turn into hex value
const hashOfOriginal = hash.update(JSON.stringify(recievedData.originalData));
// Just turning hash into hexidecimal so co0mparing the same thing 'apples to apples'
const hashOfOriginalHex = hash.digest("hex");

// Verifying hashes match by compairison
if (hashOfOriginalHex === decryptedMessageHex) {
	console.log(
		"Success! The data has not been tampered with and the sender is valid"
	);
} else {
	console.log(
		"Uh oh... Someone is trying to manipulate the data or someone else is signing the data"
	);
}
