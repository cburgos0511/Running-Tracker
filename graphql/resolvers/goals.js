const { dateToString } = require("../../helpers/date");
const { transformGoal } = require("./merge");
const Goal = require("../../models/goal");
const User = require("../../models/user");

module.exports = {
	goals: async () => {
		try {
			const goals = await Goal.find();
			return goals.map(goal => {
				return transformGoal(goal);
			});
		} catch (err) {
			throw err;
		}
	},
	createGoal: async (args, req) => {
		if (!req.isAuth) {
			throw new Error("Not Authorize to Create Goals.");
		}
		const goal = new Goal({
			title: args.goalInput.title,
			description: args.goalInput.description,
			miles: +args.goalInput.miles,
			startDate: dateToString(args.goalInput.startDate),
			endDate: dateToString(args.goalInput.endDate),
			creator: req.userId,
		});
		let createdGoals;
		try {
			const result = await goal.save();
			createdGoals = transformGoal(result);
			const creator = await User.findById(req.userId);

			if (!creator) {
				throw new Error("We cannot find User!");
			}
			creator.createdGoals.push(goal);
			await creator.save();

			return createdGoals;
		} catch (err) {
			throw err;
		}
	},
};
