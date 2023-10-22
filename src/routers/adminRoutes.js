const Router = require("express").Router();

// const multer = require("multer");
// const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const User = require("../models/user");

const {
	getAllUsers,
	getUserById,
	deleteUserById,
	toggleContentAccess,
	countUsersByAccess,
	createNewPlaylist,
	getAllPlaylists,
	getAllMedia,
	uploadMedia,
	addPlaylist,
} = require("../controllers/adminController");

const multer = require("multer");
const { isLoggedInAsAdmin } = require("../services/authServices");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		return cb(null, "./upload/media");
	},
	filename: function (req, file, cb) {
		return cb(null, `${Date.now()}_${file.originalname}`);
	},
});

const upload = multer({ storage: storage });

const spacesEndpoint = new aws.Endpoint("blr1.digitaloceanspaces.com");
const s3 = new aws.S3({
	endpoint: spacesEndpoint,
	accessKeyId: "DO00A9JCUVVL89MNRBYV",
	secretAccessKey: "2svXrYhbiDbFl09Lyqw9IpKOB8/Aydn0tPIpFnkO6ps",
});

// const upload = multer({
// 	storage: multerS3({
// 		s3: s3,
// 		bucket: "fbslmscn",
// 		acl: "public-read",
// 		key: function (request, file, cb) {
// 			console.log(file);
// 			cb(null, file.originalname);
// 		},
// 	}),
// }).array("upload", 1);

Router.get("/get-all-users", isLoggedInAsAdmin, getAllUsers);
Router.get("/get-user-by-id", isLoggedInAsAdmin, getUserById);
Router.get("/delete-user-by-id", isLoggedInAsAdmin, deleteUserById);
Router.patch("/toggle-content-access", isLoggedInAsAdmin, toggleContentAccess);
Router.get(
	"/get-active-inactive-user-number",
	isLoggedInAsAdmin,
	countUsersByAccess
);
Router.patch("/add-new-playlist-on-user", isLoggedInAsAdmin, addPlaylist);
Router.post("/add-new-playlist", isLoggedInAsAdmin, createNewPlaylist);
Router.get("/get-all-playlists", getAllPlaylists);

// route to upload media locally
Router.post(
	"/upload-media",
	upload.fields([{ name: "thumbnail" }, { name: "mediaFile" }]),
	isLoggedInAsAdmin,
	uploadMedia
);

Router.get("/get-all-media", isLoggedInAsAdmin, getAllMedia);

module.exports = Router;
