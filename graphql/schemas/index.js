const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        runs: [Run]
        createdGoals: [Goal]
    }
    
    input UserInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    type Goal {
        _id: ID!
        title: String!
        description: String!
        miles: Float!
        startDate: String!
        endDate: String!
        creator: User!
    }

    input GoalInput {
        title: String!
        description: String!
        miles: Float!
        startDate: String!
        endDate: String!
    }

    type Participant {
        _id: ID!
        goal: Goal!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Run {
        _id:ID!
        miles: Float!
        hours: Float
        minutes: Float
        seconds: Float
        date: String!
        runner: User!
    }

    input RunInput {
        userId: ID!
        miles: Float!
        hours: Float
        minutes: Float
        seconds: Float
        date: String!
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    type RootQuery {
        users: [User!]!
        user(userId: ID!): User!
        goals: [Goal!]!
        runs: [Run!]!
        participants: [Participant!]!
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createGoal(goalInput: GoalInput): Goal
        createUser(userInput: UserInput): User
        createRun(runInput: RunInput): Run
        deleteRun(runId: ID!): Run!
        joinGoal(goalId: ID!): Goal!
        leaveGoal(participantId: ID!): Goal!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
