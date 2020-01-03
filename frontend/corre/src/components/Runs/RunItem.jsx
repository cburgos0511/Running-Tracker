import React from "react";

const RunItem = ({ mile, hour, minute, second }) => {
	return (
		<li className='collection-item'>
			<div>
				<h1> Miles: {mile}</h1>
				<h2> Hours: {hour}</h2>
				<h2>Minutes: {minute}</h2>
				<h2>Seconds: {second}</h2>
			</div>
		</li>
	);
};

export default RunItem;
