import { gql } from "apollo-boost";

export default gql`
	query FetchUser($userId: ID!) {
		user(userId: $userId) {
			_id
			runs {
				_id
				miles
				hours
				minutes
				seconds
				date
			}
		}
	}
`;

/* const CREATE_RUN = gql`
	mutation CreateRun($miles: Float!, $hours: Float, $minutes: Float, $seconds: Float, $date: String!) {
		createRun(runInput: { miles: $miles, hours: $hours, minutes: $minutes, seconds: $seconds, date: $date }) {
			miles
			hours
			minutes
			seconds
			date
		}
	}
`; */
