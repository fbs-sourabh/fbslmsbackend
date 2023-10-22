const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		firstName: String,
		lastName: String,
		email: String,
		role: String,
		accessDetails: {
			hasAccess: {
				type: Boolean,
				default: false,
			},
			playlists: {
				type: [Schema.Types.ObjectId],
				// type: [String],
				ref: "Playlist",
				// default: ["java", "C++"],
			},
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
