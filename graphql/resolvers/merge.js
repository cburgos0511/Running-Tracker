const Goal = require("../../models/goal");
const User = require("../../models/user");
const Run = require("../../models/run");
const Participant = require("../../models/participant");
const { dateToString } = require("../../helpers/date");

const transformParticipant = participant => {
	return {
		...participant._doc,
		createdAt: dateToString(participant._doc.createdAt),
		updatedAt: dateToString(participant._doc.updatedAt),
		user: findUser.bind(this, participant._doc.user),
		goal: singleGoal.bind(this, participant._doc.goal),
	};
};

const transformGoal = goal => {
	return {
		...goal._doc,
		_id: goal.id,
		creator: findUser.bind(this, goal._doc.creator),
		startDate: dateToString(goal._doc.startDate),
		endDate: dateToString(goal._doc.endDate),
		participants: participants.bind(this, goal._doc.participant),
	};
};
const goals = async goalIds => {
	try {
		const goals = await Goal.find({ _id: { $in: goalIds } });
		return goals.map(goal => {
			return transformGoal(goal);
		});
	} catch (err) {
		throw err;
	}
};

const singleGoal = async goalId => {
	try {
		const goal = await Goal.findById(goalId);
		return transformGoal(goal);
	} catch (err) {
		throw err;
	}
};

const findUser = async userId => {
	try {
		const user = await User.findById(userId);
		return {
			...user._doc,
			createdGoals: goals.bind(this, user._doc.createdGoals),
			runs: runs.bind(this, user._doc.runs),
		};
	} catch (err) {
		throw err;
	}
};

const runs = async userIds => {
	try {
		const runs = await Run.find({ _id: { $in: userIds } });

		return runs.map(run => {
			return { ...run._doc, runner: findUser.bind(this, run.runner) };
		});
	} catch (err) {
		throw err;
	}
};
const participants = async userId => {
	try {
		const participants = Participant.find({ _id: { $in: userId } });
		return participants.map(participant => {
			return { ...participant._doc, participant: findUser.bind(this, participant.participants) };
		});
	} catch (err) {
		throw err;
	}
};

exports.transformParticipant = transformParticipant;
exports.transformGoal = transformGoal;
exports.findUser = findUser;
exports.singleGoal = singleGoal;
exports.goals = goals;
exports.runs = runs;
