const { transformParticipant, transformGoal } = require("./merge");
const Participant = require("../../models/participant");
const Goal = require("../../models/goal");

module.exports = {
	participants: async (args, req) => {
		if (req.isAuth) {
			throw new Error("Unauthenticated!");
		}
		try {
			const participants = await Participant.find();
			return participants.map(participant => {
				console.log(participant);
				return transformParticipant(participant);
			});
		} catch (err) {
			throw err;
		}
	},
	joinGoal: async (args, req) => {
		if (req.isAuth) {
			throw new Error("Unauthenticated!");
		}
		const fetchedGoal = await Goal.findOne({ _id: args.goalId });
		const participant = new Participant({
			user: "5dd1e05b3fddbd11bc70725d",
			goal: fetchedGoal,
		});
		let createdParticipant;
		try {
			const result = await participant.save();
			createdParticipant = transformParticipant(result);

			const goal = await Goal.findById("5dd1dd67bfda22117fdf4a90");
			if (!goal) {
				throw new Error("We cannot find User!");
			}
			goal.participants.push(participant);

			return createdParticipant;
		} catch (err) {
			throw err;
		}
	},
	leaveGoal: async (args, req) => {
		if (!req.isAuth) {
			throw new Error("Unauthenticated!");
		}
		try {
			const fetchedParticipant = await Participant.findById({
				_id: args.participantId,
			}).populate("goal");
			const goal = transformGoal(fetchedParticipant.goal);
			await Participant.deleteOne({ _id: args.participantId });
			return goal;
		} catch (err) {
			throw err;
		}
	},
};
