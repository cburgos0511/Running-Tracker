const { findUser } = require("./merge");
const { dateToString } = require("../../helpers/date");
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
			miles: args.runInput.miles,
			hours: args.runInput.hours,
			minutes: args.runInput.minutes,
			seconds: args.runInput.seconds,
			date: dateToString(args.runInput.date),
			runner: args.runInput.userId, //TEMP -> req.userId
		});
		let createdRun;
		try {
			const result = await run.save();
			createdRun = {
				...result._doc,
				runner: findUser.bind(this, result._doc.runner),
			};
			const user = await User.findById(args.runInput.userId); ///TEMP -> req.userId

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
	deleteRun: async (args, req) => {
		if (req.isAuth) {
			throw new Error("You do not have permmission to delete run");
		}

		try {
			fetchedRun = await Run.findById({
				_id: args.runId,
			});
			console.log();

			const run = {
				...fetchedRun._doc,
				runner: findUser.bind(this, fetchedRun._doc.runner),
			};

			await Run.deleteOne({ _id: args.runId });
			return run;
		} catch (err) {
			throw err;
		}
	},
};
