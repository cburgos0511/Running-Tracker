import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import FETCH_USER from "../../queries/fetchUser";
import RunItem from "../Runs/RunItem";
import AuthContext from "../../context/auth-context";

const RunsList = () => {
	const { userId } = useContext(AuthContext);
	const { loading, error, data } = useQuery(FETCH_USER, {
		variables: { userId },
	});

	if (loading)
		return (
			<div className='progress blue darken-1'>
				<div className='indeterminate'></div>
			</div>
		);

	if (error) return <p>Error </p>;

	const runs = data.user.runs.map(run => {
		return <RunItem key={run._id} mile={run.miles} hour={run.hours} minute={run.minutes} second={run.seconds} date={run.date} id={run._id} />;
	});

	return (
		<table>
			<thead>
				<tr>
					<th>Miles</th>
					<th className='center'>Time</th>
					<th className='center'>Avg. Mile (min)</th>
					<th></th>
				</tr>
			</thead>
			<tbody>{runs}</tbody>
		</table>
	);
};

export default RunsList;
