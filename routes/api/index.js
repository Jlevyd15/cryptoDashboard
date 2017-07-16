var constants = require('../../utils/constants.js');
var api = require('../../controllers/api.js');

module.exports = function(app, passport) {

	// get coin data from api
	app.get('/coinData', isLoggedIn, api.getCoinData);
	// controllers for add and update wallet addresses
	app.post('/addWallet', isLoggedIn, api.postAddWalletAddress);
	app.post('/removeWallet', isLoggedIn, api.postRemoveWalletAddress);

}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// console.log('req is', req)
    // if user is authenticated in the session, continue 
    if (req.isAuthenticated()) {
        return next();
    } else {
		// if they aren't send an error
		res.status(401).json({ error: 'unauthorized, please login' });
    }
}