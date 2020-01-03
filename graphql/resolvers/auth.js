const User = require("../../models/user");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { goals, runs } = require("./merge");

module.exports = {
	users: async (args, req) => {
		if (!req.isAuth) {
			throw new Error("Unauthenticated!");
		}
		try {
			const users = await User.find();
			return users.map(user => {
				return {
					...user._doc,
					createdGoals: goals.bind(this, user._doc.createdGoals),
					runs: runs.bind(this, user._doc.runs),
				};
			});
		} catch (err) {
			throw err;
		}
	},
	createUser: async args => {
		try {
			const user = await User.findOne({ email: args.userInput.email });

			if (user) {
				throw new Error("User exists already!");
			}
			const hashedPassword = await bcript.hash(args.userInput.password, 12);

			const newUser = new User({
				firstName: args.userInput.firstName,
				lastName: args.userInput.lastName,
				age: args.userInput.age,
				email: args.userInput.email,
				password: hashedPassword,
			});
			const result = await newUser.save();
			return { ...result._doc, password: null };
		} catch (err) {
			throw err;
		}
	},
	login: async ({ email, password }) => {
		const user = await User.findOne({ email });

		if (!user) {
			throw new Error("User does not exist!");
		}

		const isEqual = await bcript.compare(password, user.password);

		if (!isEqual) {
			throw new Error("Password is not correct!");
		}

		const token = jwt.sign({ userId: user.id, email: user.email }, "somesupersecretekey", {
			expiresIn: "1h",
		});
		return {
			userId: user.id,
			token: token,
			tokenExpiration: 1,
		};
	},
};
