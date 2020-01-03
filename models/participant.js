const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const participantSchema = new Schema(
	{
		goal: {
			type: Schema.Types.ObjectId,
			ref: "Goal",
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Participant", participantSchema);
