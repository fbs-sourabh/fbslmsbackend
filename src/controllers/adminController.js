const User = require("../models/user");
const Playlist = require("../models/playlists");
const Media = require("../models/media");

const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		return cb(null, "./upload/media");
	},
	filename: function (req, file, cb) {
		return cb(null, `${Date.now()}_${file.originalname}`);
	},
});

const upload = multer({ storage });

const getAllUsers = async (req, res) => {
	try {
		const allUsers = await User.find().populate({
			path: "accessDetails.playlists",
		});
		res.send(allUsers);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};

const getUserById = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.body.id }).exec();
		if (!user) {
			return res.status(422).json({
				error: "User not found",
			});
		}
		console.log(user);
		res.status(200).json({ message: "User successfully found" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deleteUserById = async (req, res) => {
	try {
		const user = await User.deleteOne({ email: req.body.email }).exec();
		if (!user) {
			return res.status(422).json({
				error: "User not found",
			});
		}
		console.log(user);
		res.status(200).json({ message: "User successfully found" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const toggleContentAccess = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.body.id }).exec();
		if (!user) {
			return res.status(422).json({
				error: "User not found",
			});
		}
		console.log(user);
		user.accessDetails.hasAccess = !user.accessDetails.hasAccess;
		await user.save();
		console.log(user);
		res.status(200).json({
			message: `Access for ${user.email} ${
				user.accessDetails.hasAccess ? "Enabled" : "Revoked"
			}`,
			user: user,
		});
	} catch (error) {
		console.log(error.message);
		res.send(error.message);
	}
};

const addPlaylist = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.body.id }).exec();
		if (!user) {
			return res.status(422).json({
				error: "User not found",
			});
		}
		console.log(user);
		pl = req.body.playlist;
		user.accessDetails.playlists.push(pl);
		await user.save();
		console.log(user);
		res.status(200).json({
			message: `Access tp ${pl} granted to for ${user.email}`,
			user: user,
		});
	} catch (error) {
		console.log(error.message);
		res.send(error.message);
	}
};

const countUsersByAccess = async (req, res) => {
	try {
		const hasAccessCount = await User.countDocuments({ hasAccess: true });
		const noAccessCount = await User.countDocuments({ hasAccess: false });
		res.json({ hasAccess: hasAccessCount, noAccess: noAccessCount });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const createNewPlaylist = async (req, res) => {
	try {
		const newPlaylist = new Playlist({
			label: req.body.label,
		});

		const existingPlaylist = await Playlist.findOne({
			label: newPlaylist.label,
		});

		if (existingPlaylist) {
			return res.status(400).json({ error: "Playlist exists" });
		}

		const playlist = await newPlaylist.save(); // Await the query execution

		console.log(playlist); // Log the retrieved data
		res.send(playlist); // Send the data as the response
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};

const getAllPlaylists = async (req, res) => {
	console.log("request received");
	try {
		const allPlaylists = await Playlist.find().exec();
		res.send(allPlaylists);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};

const uploadMedia = async (req, res) => {
	try {
		if (
			req.files &&
			req.files["thumbnail"] &&
			req.files["mediaFile"] &&
			req.body.title &&
			req.body.playlist
		) {
			const thumbnailFile = req.files["thumbnail"][0];
			const mediaFile = req.files["mediaFile"][0];

			var thumbnailFilePath = `${thumbnailFile.destination}/${thumbnailFile.filename}`;
			thumbnailFilePath = `http://localhost:8000${thumbnailFilePath.slice(1)}`;

			var mediaFilePath = `${mediaFile.destination}/${mediaFile.filename}`;
			mediaFilePath = `http://localhost:8000${mediaFilePath.slice(1)}`;

			const newMedia = new Media({
				meta: {
					title: req.body.title,
					desc: req.body.description || "",
					tags: [],
				},
				links: {
					mediaPath: mediaFilePath,
					thumbnailPath: thumbnailFilePath,
				},
				analytics: {
					playedFor: 0,
				},
				playlist: req.body.playlist,
			});

			await newMedia.save();

			console.log(newMedia);

			res
				.status(200)
				.json({ message: "Media upload data received", data: newMedia });
		} else {
			res.status(400).json({ error: "Invalid request data" });
		}
	} catch (error) {
		console.error("Error handling media upload:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getAllMedia = async (req, res) => {
	try {
		allMedia = await Media.find().populate("playlist");
		res.json({ count: allMedia.length, allMedia });
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	deleteUserById,
	toggleContentAccess,
	countUsersByAccess,
	createNewPlaylist,
	getAllPlaylists,
	getAllMedia,
	uploadMedia,
	toggleContentAccess,
	addPlaylist,
};
