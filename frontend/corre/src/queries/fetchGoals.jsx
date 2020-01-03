import { gql } from "apollo-boost";

export default gql`
	{
		goals {
			_id
			title
			description
			miles
			startDate
			endDate
			creator {
				_id
				firstName
			}
		}
	}
`;
