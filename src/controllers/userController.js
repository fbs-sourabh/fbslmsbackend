const Media = require("../models/media");

const getMediaByPlaylist = async (req, res) => {
	const playlist = req.params.playlist;
	console.log(playlist);
	let media = await Media.find({ playlist: playlist }).populate("playlist");
	res.json({ media: media });
};

const getCurrentMediaDetails = async (req, res) => {
	const m = req.params.m;
	console.log("media from getCurrentMediaDetails -----", m);
	const media = await Media.findOne({ "links.mediaPath": m }).populate(
		"playlist"
	);
	if (!media) {
		console.log("___media not found____");
		res.status(404).send("asset not found");
	} else {
		let responseBody = {};
		responseBody.title = media.meta.title;
		responseBody.desc = media.meta.desc;
		res.send({ media: responseBody });
	}
};

module.exports = { getMediaByPlaylist, getCurrentMediaDetails };
