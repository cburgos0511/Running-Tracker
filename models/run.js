const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const runSchema = new Schema({
	miles: {
		type: Number,
		required: true,
	},
	hours: {
		type: Number,
	},
	minutes: {
		type: Number,
	},
	seconds: {
		type: Number,
	},
	runner: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("Run", runSchema);
