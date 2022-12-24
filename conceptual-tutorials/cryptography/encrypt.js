const crypto = require("crypto");

// For Data encryption not identity encryption, i.e encrypt with public key decrypt with private
function encryptWithPublicKey(publicKey, message) {
	// Takes Message, creates a node buffer with utf8 formatting
	const bufferMessage = Buffer.from(message, "utf8");

	// passess buffer to built in publicEncrypt method of node crypto library
	return crypto.publicEncrypt(publicKey, bufferMessage);
}

// Encrypting with privateKey for use case of digital signature
function encryptWithPrivateKey(privateKey, message) {
	const bufferMessage = Buffer.from(message, "utf8");

	return crypto.privateEncrypt(privateKey, bufferMessage);
}

module.exports.encryptWithPublicKey = encryptWithPublicKey;
module.exports.encryptWithPrivateKey = encryptWithPrivateKey;
