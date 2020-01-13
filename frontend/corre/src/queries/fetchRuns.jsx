import { gql } from "apollo-boost";

export default gql`
	{
		runs {
			_id
			miles
			hours
			minutes
			seconds
			date
		}
	}
`;
