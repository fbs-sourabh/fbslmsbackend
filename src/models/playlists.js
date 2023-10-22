const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistSchema = new Schema(
	{
		label: String,
		subscribers: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
