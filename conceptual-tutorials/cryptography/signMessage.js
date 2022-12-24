const crypto = require("crypto");
// sha256 hash - trapdoor function that takes in any size data (infinetely large?) and hashes it to a value (always same output for same input) that can be small enough to transport, always 64 characters long nop matter size of data each character 4 bits which = 256,
const hash = crypto.createHash("sha256");
const fs = require("fs");
const encrypt = require("./encrypt");
const decrypt = require("./decrypt");

const myData = {
	firstName: "Tom",
	lastName: "Fowler",
	socialSecurityNumber: `NEVER PUT PERSONAL INFO INTO A DIFITALLY SIGNED MESSAGE AS THIS FORM OF CRYPTOGRAPHY DOESN'T HIDE DATA`,
};

// JSON String version of our data that can be hashed
const myDataString = JSON.stringify(myData);

// node crypto library Sets the value on the hash object: requires string format, so we must convert our
hash.update(myDataString);

// Hashed Data in a hexadecimal format - format is very important when using crypto library
const hashedData = hash.digest("hex");

const senderPrivateKey = fs.readFileSync(
	__dirname + "/id_rsa_priv.pem",
	"utf8"
);

const signedMessage = encrypt.encryptWithPrivateKey(
	senderPrivateKey,
	hashedData
);

// Need to provide the reciever with additonal data, the hash function used to hash data & the original data

const packageOfDataToSend = {
	algorithm: "sha256",
	originalData: myData,
	signedAndEncryptedData: signedMessage,
};

module.exports.packageOfDataToSend = packageOfDataToSend;
