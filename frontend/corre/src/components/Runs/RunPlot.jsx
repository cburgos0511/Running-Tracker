import React, { useEffect, useRef, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import FETCH_USER from "../../queries/fetchUser";
import AuthContext from "../../context/auth-context";
import { select, axisBottom, axisLeft, scaleLinear } from "d3";

const RunPlot = () => {
	const { userId } = useContext(AuthContext);

	const { loading, error, data } = useQuery(FETCH_USER, {
		variables: { userId },
	});
	const svgRef = useRef();
	const hr = data.user.runs.map(run => (run.hours === null ? 0 : run.hours));
	const min = data.user.runs.map(run => (run.minutes === null ? 0 : run.minutes));
	const sec = data.user.runs.map(run => (run.seconds === null ? 0 : run.seconds));
	const mile = data.user.runs.map(run => run.miles);
	const date = data.user.runs.map(run => Number(run.date));

	const totalTime = (h, m, s) => {
		let arr = [];
		let sum = 0;
		for (let i = 0; i < h.length; i++) {
			sum = h[i] * 60 + m[i] + s[i] / 60;
			arr.push(Math.round(sum));
		}
		return arr;
	};

	let tlTime = totalTime(hr, min, sec);
	useEffect(() => {
		const svg = select(svgRef.current);

		const xScale = scaleLinear()
			.domain([Math.min(...date) - 10000000, Math.max(...date) + 10000000])
			.range([0, 1200]);

		const yScale = scaleLinear()
			.domain([0, Math.max(...tlTime) + 50])
			.range([600, 0]);

		const zScale = scaleLinear()
			.domain([0, Math.max(...mile)])
			.range([1, 20]);
		const xAxis = axisBottom(xScale);

		svg.select(".x-axis")
			.style("transform", "translateY(600px)")
			.call(xAxis);

		const yAxis = axisLeft(yScale);
		svg.select(".y-axis").call(yAxis);
		// Add dots
		svg.append("g")
			.selectAll("dot")
			.data(data.user.runs)
			.enter()
			.append("circle")
			.attr("cx", val => xScale(val.date)) //Dates
			.attr("r", val => zScale(val.miles)) //Miles
			.data(tlTime)
			.attr("cy", val => yScale(val))
			.style("fill", "#64b5f6")
			.style("opacity", "1")
			.attr("stroke", "none");

		// svg.selectAll("circle")
		// 	.transition()
		// 	.duration(1500)
		// 	.delay((val, index) => index * 3);
	}, [data.user.runs, date, hr, mile, min, tlTime]);

	if (loading)
		return (
			<div className='progress blue darken-1'>
				<div className='indeterminate'></div>
			</div>
		);

	if (error) return <p>Error </p>;

	return (
		<div>
			<h1>Scatter PLot Graph</h1>
			<svg ref={svgRef}>
				<g className='x-axis' />
				<g className='y-axis' />
			</svg>
		</div>
	);
};

export default RunPlot;
