const authResolver = require("./auth");
const participantResolver = require("./participant");
const runsResolver = require("./runs");
const goalsResolver = require("./goals");

const rootResolver = {
	...authResolver,
	...goalsResolver,
	...runsResolver,
	...participantResolver,
};

module.exports = rootResolver;
