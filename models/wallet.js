//Model - wallet.js

var mongoose = require('mongoose');
Schema = mongoose.Schema;

// define the schema for our user model
var walletSchema = new Schema({

	walletData: {
		type: String,
		address: String,
	}
});

// create the model for wallet and expose it to our app
module.exports = mongoose.model('Wallet', walletSchema);