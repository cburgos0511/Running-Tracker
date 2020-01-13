/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import AuthContext from "../../context/auth-context";
import Modal from "../Modal/Modal";
import RunsList from "../Runs/RunList";
import FETCH_USER from "../../queries/fetchUser";
import RunBar from "../Runs/RunBar";
import RunPlot from "../Runs/RunPlot";
import { gql } from "apollo-boost";

const CREATE_RUN = gql`
	mutation CreateRun($userId: ID!, $miles: Float!, $hours: Float, $minutes: Float, $seconds: Float, $date: String!) {
		createRun(runInput: { userId: $userId, miles: $miles, hours: $hours, minutes: $minutes, seconds: $seconds, date: $date }) {
			miles
			hours
			minutes
			seconds
			date
		}
	}
`;

const Runs = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [hours, setHours] = useState("");
	const [miles, setMiles] = useState("");
	const [minutes, setMinutes] = useState("");
	const [seconds, setSeconds] = useState("");
	const [date, setDate] = useState("");
	const [view, setView] = useState("list");

	const context = useContext(AuthContext);

	const renderCreateRunForm = () => {
		return (
			<div className='row'>
				<form autoComplete='off' className='col s12'>
					<div className='row'>
						<div className='input-field col s12'>
							<label htmlFor='miles'>Miles</label>
							<input type='text' className='validate' id='miles' value={miles} onChange={e => setMiles(e.target.value)} />
						</div>
					</div>
					<div className='row'>
						<div className='input-field col s12'>
							<label htmlFor='date'>Date</label>
							<input type='date' className='validate' placeholder='DD/MM/YYYY' id='date' value={date} onChange={e => setDate(e.target.value)}></input>
						</div>
					</div>
					<div className='row'>
						<div className='input-field col s12'>
							<label htmlFor='hour'>Hours</label>
							<input type='text' className='validate' id='hour' maxLength='120' value={hours} onChange={e => setHours(e.target.value)}></input>
						</div>
					</div>
					<div className='row'>
						<div className='input-field col s6'>
							<label htmlFor='minutes'>Minutes</label>
							<input type='text' placeholder='' className='validate' id='minutes' value={minutes} onChange={e => setMinutes(e.target.value)} />
						</div>
						<div className='input-field col s6'>
							<label htmlFor='seconds'>Seconds</label>
							<input type='text' placeholder='' className='validate' id='seconds' value={seconds} onChange={e => setSeconds(e.target.value)} />
						</div>
					</div>
				</form>
			</div>
		);
	};

	const [createRun] = useMutation(CREATE_RUN, {
		variables: { userId: context.userId, miles: parseFloat(miles), hours: parseFloat(hours), minutes: parseFloat(minutes), seconds: parseFloat(seconds), date },
		refetchQueries: () => [
			{
				query: FETCH_USER,
				variables: {
					userId: context.userId,
				},
			},
		],
	});
	const reset = () => {
		setHours("");
		setMiles("");
		setMinutes("");
		setSeconds("");
		setDate("");
	};
	const openModal = () => {
		setIsOpen(true);
	};

	const onCancel = () => {
		setIsOpen(false);
	};

	const onCreate = e => {
		e.preventDefault();

		createRun();
		reset();
		setIsOpen(false);
	};

	const iconColor = isOpen ? "grey darken-3" : "blue darken-1";
	return (
		<>
			<Modal onCancel={onCancel} onCreate={onCreate} show={isOpen} withCancel withCreate actionName='Create' title='Add Run'>
				{renderCreateRunForm()}
			</Modal>

			<div className='container'>
				<div className='tabs-container'>
					<div id='tabs' className='row'>
						<div className='col s12'>
							<ul className='tabs'>
								<li className='tab col s3' onClick={() => setView("list")}>
									<a href='#'>
										<i className='material-icons'>list</i>
									</a>
								</li>
								<li className='tab col s3' onClick={() => setView("bar")}>
									<a href='#'>
										<i id='sort' className='material-icons'>
											sort
										</i>
									</a>
								</li>
								<li className='tab col s3' onClick={() => setView("plot")}>
									<a href='#'>
										<i className='material-icons'>timeline</i>
									</a>
								</li>
							</ul>
						</div>
					</div>
					{view !== "list" ? (
						<div></div>
					) : (
						<>
							<div onClick={openModal} id='add-run-btn' className={`right waves-effect waves-light btn-floating ${iconColor}`}>
								<i className='material-icons'>add</i>
							</div>
						</>
					)}
				</div>
				{view === "list" ? <RunsList /> : view === "bar" ? <RunBar /> : <RunPlot />}
			</div>
		</>
	);
};

export default Runs;
/* 		const request = {
			query: `
				mutation CreateRun($miles: Float!, $hr: Float, $min: Float, $sec: Float, $date: String!) {
					createRun(runInput: {miles: $miles, hours: $hr, minutes: $min, seconds: $sec, date: $date}) {
						miles
						hours
						minutes
						seconds
						date
					}
				}
			`,
			variables: {
				miles: parseFloat(miles),
				hr: parseFloat(hours),
				min: parseFloat(minutes),
				sec: parseFloat(seconds),
				date: date,
			},
		};

		const token = context.token;

		fetch("http://localhost:4000/graphql", {
			method: "POST",
			body: JSON.stringify(request),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Failed!");
				}
				return res.json();
			})
			.then(resData => {
				refetch();
				setIsOpen(false);
				reset();
			})
			.catch(err => {
				console.log(err);
			}); */
