const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const instructorSchema = new Schema(
	{
		firstName: String,
		lastName: String,
		bio: String,
		courses: {
			type: Schema.Types.ObjectId,
			ref: "Playlist",
		},
	},
	{
		timestamps: true,
	}
);

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
