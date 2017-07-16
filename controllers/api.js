// controllers for API
var request = require('request');
var User = require('../models/user');

exports.getCoinData = function(req, res) {
	console.log('in coin data get route callback')
	res.json(req.user)
};

// add a wallet address
exports.postAddWalletAddress = function(req, res) {

	var walletObj = {
		"id": Date.now(),
		"type": req.body.type,
		"address": req.body.address,
	}

	User.findOne({
		'local.email': req.user.local.email
	}, function(err, user) {
		// if there are any errors, return the error
		if (err)
			return done(err);
		if (user) {
			User.update({'local.email': user.local.email}, { $push: {'local.walletData': walletObj}}, function(err, results) {
				if (err) {
					// If it failed, return error
					res.send("There was a problem adding the information to the database. " + err);
				} else {
					res.json(walletObj);
					console.log("Added new wallet" + walletObj.address);
				}
			});
		} else {
			res.send('no user found')
		}
	})
}

// remove a wallet address
exports.postRemoveWalletAddress = function(req, res) {

	var walletObj = {
		"address": req.body.address,
	}

	User.findOne({'local.email': req.user.local.email}, function(err, user) {
		// if there are any errors, return the error
		if (err)
			return done(err);
		if (user) {
			// filter out the object in walletData that matches the address send by the use
			user.local.walletData = user.local.walletData.filter(function(obj) {
				return obj.address !== walletObj.address
			})

			User.update({'local.email': user.local.email}, {'local.walletData': user.local.walletData}, function(err, results) {
				if (err) {
					// If it failed, return error
					res.send("There was a problem adding the information to the database. " + err);
				} else {
					User.findOne({'local.email': req.user.local.email}, function(err, user) {
						if (user) {
							res.json(user);
						} else {
							res.send("There was a problem adding the information to the database. " + err);
						}
					})
				}
			});
		} else {
			res.send('no user found')
		}
	})
}