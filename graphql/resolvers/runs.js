const { findUser } = require("./merge");
const User = require("../../models/user");
const Run = require("../../models/run");

module.exports = {
	runs: async (args, req) => {
		if (req.isAuth) {
			throw new Error("Unauthenticated! BRO");
		}
		try {
			const runs = await Run.find();
			return runs.map(run => {
				console.log(runs);
				return {
					...run._doc,
					runner: findUser.bind(this, run._doc.runner),
				};
			});
		} catch (err) {
			throw err;
		}
	},
	createRun: async (args, req) => {
		if (req.isAuth) {
			throw new Error("Unauthenticated!");
		}
		const run = new Run({
			miles: +args.runInput.miles,
			hours: +args.runInput.hours,
			minutes: +args.runInput.minutes,
			seconds: +args.runInput.seconds,
			runner: "5dd1e05b3fddbd11bc70725d", //TEMP -> req.userId
		});
		let createdRun;
		try {
			const result = await run.save();
			createdRun = {
				...result._doc,
				runner: findUser.bind(this, result._doc.runner),
			};
			const user = await User.findById("5dd1e05b3fddbd11bc70725d"); ///TEMP -> req.userId

			if (!user) {
				throw new Error("We cannot find User!");
			}
			user.runs.push(run);
			await user.save();

			return createdRun;
		} catch (err) {
			throw err;
		}
	},
};
