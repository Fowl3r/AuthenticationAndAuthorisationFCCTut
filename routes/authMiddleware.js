/* Writin Auth middleware */

module.exports.isAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res
			.status(401)
			.json({ msg: "You are not authorised to view this resource" });
	}
};

module.exports.isAdmin = (req, res, next) => {
	// also requires admin boolean to be true
	if (req.isAuthenticated() && req.user.admin) {
		next();
	} else {
		res
			.status(401)
			.json({
				msg: "You are not authorised to view this resource, because you are not an admin",
			});
	}
};
