const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./playlists");

const mediaSchema = new Schema(
	{
		meta: {
			title: String,
			desc: String,
			tags: [],
		},
		links: {
			mediaPath: String,
			thumbnailPath: String,
		},
		analytics: {
			playedFor: Number,
		},
		playlist: {
			type: Schema.Types.ObjectId,
			ref: "Playlist",
		},
	},
	{
		timestamps: true,
	}
);

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;
