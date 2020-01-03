import React from "react";
import GoalItem from "./GoalItem";
import { useQuery } from "@apollo/react-hooks";
import GOALS_QUERY from "../../queries/fetchGoals";

const GoalsList = () => {
	const { loading, error, data } = useQuery(GOALS_QUERY);

	if (loading)
		return (
			<div className='progress blue darken-1'>
				<div className='indeterminate'></div>
			</div>
		);

	if (error) return <p>Error </p>;

	const goals = data.goals.map(goal => {
		return (
			<GoalItem
				creatorName={goal.creator.firstName}
				creatorId={goal.creator._id}
				key={goal._id}
				goalId={goal._id}
				description={goal.description}
				start={goal.startDate}
				end={goal.endDate}
				title={goal.title}
				miles={goal.miles}
			/>
		);
	});

	return (
		<ul className='collection with-header'>
			<li className='collection-header'>
				<h3 className='collection__header'>Running Goals</h3>
			</li>
			{goals}
		</ul>
	);
};

export default GoalsList;
