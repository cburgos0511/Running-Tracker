import React, { useRef, useEffect, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import FetchUser from "../../queries/fetchUser";
import AuthContext from "../../context/auth-context";
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from "d3";

const RunBar = () => {
	const { userId } = useContext(AuthContext);
	const { loading, error, data } = useQuery(FetchUser, {
		variables: { userId },
	});
	const svgRef = useRef();
	let hr = data.user.runs.map(run => (run.hours === null ? 0 : run.hours));
	let min = data.user.runs.map(run => (run.minutes === null ? 0 : run.minutes));
	let sec = data.user.runs.map(run => (run.seconds === null ? 0 : run.seconds));
	let mile = data.user.runs.map(run => run.miles);

	console.log(data);

	const avePace = (mile, hr, min, sec) => {
		let ap = [];
		let totalMin;
		//conver everything to minutes
		for (let i = 0; i < mile.length; i++) {
			hr[i] = hr[i] * 60;
			sec[i] = sec[i] / 60;
			totalMin = min[i] + hr[i] + sec[i];
			ap.push(totalMin / mile[i]);
		}

		return ap;
	};

	let pace = avePace(mile, hr, min, sec);
	let paceFixed = pace.map(p => Number(p.toFixed(0)));

	const getPaceSec = pace => {
		let seconds;
		let secArray = [];
		let strSecOfPace = pace.map(p => String(p).split(".")[1]);

		for (let i = 0; i < strSecOfPace.length; i++) {
			if (strSecOfPace[i] === undefined) {
				secArray.push(0);
			} else {
				seconds = Math.round(Number("." + strSecOfPace[i]) * 60);
				secArray.push(seconds);
			}
		}

		return secArray;
	};

	let secArray = getPaceSec(avePace(mile, hr, min, sec));

	const arrayOfPace = (arr, arr2) => {
		let paces = [];
		for (let i = 0; i < arr.length; i++) {
			if (arr2[i] < 10) {
				paces.push(arr[i] + ":0" + arr2[i]);
			} else {
				paces.push(arr[i] + ":" + arr2[i]);
			}
		}

		return paces;
	};

	let arrPaceWithSec = arrayOfPace(paceFixed, secArray);

	useEffect(() => {
		const svg = select(svgRef.current);

		const xScale = scaleBand()
			.domain(data.user.runs.map((val, index) => index))
			.range([0, 1200])
			.padding(0.5);

		const yScale = scaleLinear()
			.domain([0, Math.max(...mile) + 5])
			.range([600, 0]);

		const xAxis = axisBottom(xScale);

		svg.select(".x-axis")
			.style("transform", "translateY(600px)")
			.call(xAxis);

		const yAxis = axisLeft(yScale);
		svg.select(".y-axis")
			// .style("transform", "translateX(300px)")
			.call(yAxis);

		// rectangles

		svg.selectAll(".bar")
			.data(data.user.runs.map(run => run.miles))
			.join("rect")
			.attr("class", "bar")
			.style("transform", "scale(1, -1)")
			.attr("x", (val, index) => xScale(index))
			.attr("y", -600)
			.attr("width", xScale.bandwidth())
			.on("mouseenter", (val, index) => {
				svg.selectAll(".tooltip")
					.data(data.user.runs.map(run => run.minutes))
					.join(enter => enter.append("text").attr("y", yScale(val) + 8))
					.attr("class", "tooltip")
					.text(arrPaceWithSec[index] + " pace")
					.attr("x", xScale(index) + xScale.bandwidth() / 2)
					.attr("text-anchor", "middle")
					.transition()
					.duration(300)
					.attr("y", yScale(val) - 8)
					.attr("opacity", 1);
			})
			.on("mouseleave", () => svg.selectAll(".tooltip").remove())
			.transition()
			.duration(800)
			.attr("height", val => 600 - yScale(val))
			.attr("fill", "#0d47a1");
	}, [arrPaceWithSec, data.user.runs, mile]);

	if (loading)
		return (
			<div className='progress blue darken-1'>
				<div className='indeterminate'></div>
			</div>
		);

	if (error) return <p>Error </p>;

	return (
		<>
			<h1>Bar Graph</h1>
			<svg ref={svgRef}>
				<g className='x-axis' />
				<g className='y-axis' />
			</svg>
		</>
	);
};

export default RunBar;
