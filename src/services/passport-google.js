const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/api/v1/auth",
			passReqToCallback: true,
		},
		function (request, accessToken, refreshToken, profile, done) {
			User.findOne({ email: profile.emails[0].value })
				.then((user) => {
					if (user) {
						// console.log(null, profile, "from user exists check");
						return done(null, profile);
					}

					const newUser = new User({
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						email: profile.emails[0].value,
						// password: hashSync(password, 10),
						role: "default",
					});

					newUser
						.save()
						.then((createdUser) => {
							console.log("created user : ", createdUser);
							return done(null, profile);
						})
						.catch((err) => {
							console.log(err.message);
							return err, null;
						});
				})
				.catch((err) => {
					console.log(err.message);
					return err, null;
				});
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});
