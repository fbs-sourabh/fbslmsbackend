const User = require("../models/user");

function isLoggedIn(req, res, next) {
	req.user ? next() : res.sendStatus(401);
}

async function isLoggedInAsAdmin(req, res, next) {
	if (req.user) {
		let user = await User.find({ email: req.user.emails[0].value }).exec();
		const u = user[0];
		if (u.role === "admin") {
			next();
		} else {
			res.status(401).send({ error: "unauthorized" });
		}
	} else {
		res.sendStatus(401);
	}
}

module.exports = { isLoggedIn, isLoggedInAsAdmin };
