const crypto = require("crypto");

function decryptWithPrivateKey(privateKey, encryptedMessage) {
	// privateDecrypt method of node crypto library
	return crypto.privateDecrypt(privateKey, encryptedMessage);
}

function decryptWithPublicKey(PublicKey, encryptedMessage) {
	// Public Decrypt method of node crypto library
	return crypto.PublicDecrypt(PublicKey, encryptedMessage);
}

module.exports.decryptWithPrivateKey = decryptWithPrivateKey;
module.exports.decryptWithPublicKey = decryptWithPublicKey;
