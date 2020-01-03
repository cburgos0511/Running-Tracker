import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import AuthContext from "../../context/auth-context";
import Modal from "../Modal/Modal";
import RunsList from "../Runs/RunList";
import RUN_QUERY from "../../queries/fetchRuns";

const Runs = () => {
	const { refetch } = useQuery(RUN_QUERY);
	const [isOpen, setIsOpen] = useState(false);
	const [hours, setHours] = useState("");
	const [miles, setMiles] = useState("");
	const [minutes, setMinutes] = useState("");
	const [seconds, setSeconds] = useState("");

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
	const openModal = () => {
		setIsOpen(true);
	};

	const onCancel = () => {
		setIsOpen(false);
	};

	const onCreate = e => {
		setIsOpen(false);
		e.preventDefault();

		const request = {
			query: `
				mutation {
					createRun(runInput: {miles: "${miles}", hours: "${hours}", minutes: ${minutes}, seconds: "${seconds}"}) {
						miles
						hours
						minutes
						seconds
					}
				}
			`,
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
				console.log(resData);
				refetch();
			})
			.catch(err => {
				console.log(err);
			});
	};

	const iconColor = isOpen ? "grey darken-3" : "blue darken-1";

	return (
		<div className='container'>
			<Modal onCancel={onCancel} onCreate={onCreate} show={isOpen} withCancel withCreate actionName='Create' title='Add Run'>
				{renderCreateRunForm()}
			</Modal>
			<RunsList />
			<div onClick={openModal} className={`right waves-effect waves-light btn-floating ${iconColor}`}>
				<i className='material-icons'>add</i>
			</div>
		</div>
	);
};

export default Runs;
