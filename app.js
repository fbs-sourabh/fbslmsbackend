console.clear();

// core imports
const path = require("path");
const Express = require("express");

// imports
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

// route import
const healthRoute = require("./src/routers/healthRoutes");
const userRoutes = require("./src/routers/userRoutes");
const authRoutes = require("./src/routers/authRoutes");
const adminRoutes = require("./src/routers/adminRoutes");

// app config
const app = Express();
const session = require("express-session");
const passport = require("passport");
require("./src/config/db");
require("./src/services/passport-google");

// const staticDirectory = path.join(__dirname, "upload");

// middleware

const allowedOrigins = [
	// "http://localhost:3000",
	"https://fbs-lms-client.onrender.com",
];
app.use(
	cors({
		origin: allowedOrigins,
		methods: "GET,POST,PUT, PATCH, DELETE",
		credentials: true,
	})
);
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
// app.use(Express.static(staticDirectory));
app.use("/upload", Express.static(path.join(__dirname, "upload")));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// route config
app.use("/", healthRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);

const PORT = process.env.PORT || 1808;

app.listen(PORT, () => {
	console.log("server started on port ", PORT);
});
