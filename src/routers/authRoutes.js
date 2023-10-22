const router = require("express").Router();
const passport = require("passport");

const User = require("../models/user");
const { isLoggedIn } = require("../services/authServices");

function returnUser() {
	User.find({ email: req.user.emails[0].value }).then((user) => {
		if (!user) {
			console.log("no user found");
			res.send("error");
		}
		let u = user[0];
		return { user: u };
	});
}

router.get(
	"/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
	"/",
	passport.authenticate("google", {
		// successRedirect: "http://localhost:3000",
		successRedirect: "https://fbs-lms-client.onrender.com",
		failureRedirect: "/api/v1/auth/failure",
	}),
	(req, res) => {
		res.send(returnUser());
	}
);

router.get("/protected", isLoggedIn, (req, res) => {
	User.find({ email: req.user.emails[0].value }).then((user) => {
		if (!user) {
			console.log("no user found");
			res.send("error");
		}
		let u = user[0];
		res.json(u);
	});
});

router.get("/user-info", isLoggedIn, async (req, res) => {
	console.log("request received to check logged in user");
	try {
		let user = await User.find({ email: req.user.emails[0].value }).populate({
			path: "accessDetails.playlists",
		});
		if (!user) {
			res.status(500).send("user not found");
		} else {
			console.log(user);
			res.send({ user: user[0] });
		}
	} catch (error) {
		console.log(error.message);
	}
});

router.get("/logout", (req, res) => {
	req.logout(() => {
		req.session.destroy(() => {
			res.send({ status: "loggedOut" });
		});
	});
});

module.exports = router;
