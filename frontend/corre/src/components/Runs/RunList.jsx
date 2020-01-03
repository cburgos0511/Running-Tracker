import React from "react";
import { useQuery } from "@apollo/react-hooks";
import RUNS_QUERY from "../../queries/fetchRuns";
import RunItem from "../Runs/RunItem";

const RunsList = () => {
	const { loading, error, data } = useQuery(RUNS_QUERY);

	if (loading)
		return (
			<div className='progress blue darken-1'>
				<div className='indeterminate'></div>
			</div>
		);

	if (error) return <p>Error </p>;

	const runs = data.runs.map(run => {
		return <RunItem key={run._id} mile={run.miles} hour={run.hours} minute={run.minutes} second={run.seconds} />;
	});
	return (
		<ul className='collection with-header'>
			<li className='collection-header'>
				<h3 className='collection__header'>My Runs</h3>
			</li>
			{runs}
		</ul>
	);
};

export default RunsList;
