import React, { useContext, useState } from "react";
import Modal from "../Modal/Modal";
import AuthContext from "../../context/auth-context";
import GoalsList from "../Goals/GoalsList";
import { useQuery } from "@apollo/react-hooks";
import GOALS_QUERY from "../../queries/fetchGoals";

const Goals = () => {
	const { refetch } = useQuery(GOALS_QUERY);
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [miles, setMiles] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const context = useContext(AuthContext);

	const renderCreateGoalForm = () => {
		return (
			<div className='row'>
				<form autoComplete='off' className='col s12'>
					<div className='row'>
						<div className='input-field col s12'>
							<label htmlFor='title'>Title</label>
							<input type='text' className='validate' id='title' value={title} onChange={e => setTitle(e.target.value)} />
						</div>
					</div>

					<div className='row'>
						<div className='input-field col s12'>
							<label htmlFor='description'>Description</label>
							<textarea
								type='text'
								className='materialize-textarea'
								id='description'
								maxLength='120'
								value={description}
								onChange={e => setDescription(e.target.value)}></textarea>
						</div>
					</div>

					<div className='row'>
						<div className='input-field col s12'>
							<label htmlFor='miles'>Miles</label>
							<input type='text' className='validate' id='miles' value={miles} onChange={e => setMiles(e.target.value)} />
						</div>
					</div>

					<div className='row'>
						<div className='input-field col s6'>
							<label htmlFor='start_date'>Start Date</label>
							<input type='date' placeholder='' className='validate' id='start_date' value={startDate} onChange={e => setStartDate(e.target.value)} />
						</div>
						<div className='input-field col s6'>
							<label htmlFor='end_date'>End Date</label>
							<input type='date' placeholder='' className='validate' id='end_date' value={endDate} onChange={e => setEndDate(e.target.value)} />
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
					createGoal(goalInput: {title: "${title}", description: "${description}", miles: ${miles}, startDate: "${startDate}", endDate: "${endDate}"}){
						title
						description
						miles
						startDate
						endDate
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
		<>
			<div className='container'>
				<Modal onCancel={onCancel} onCreate={onCreate} withCancel withCreate show={isOpen} actionName='Create' title='ADD A GROUP RUNNING GOAL'>
					{renderCreateGoalForm()}
				</Modal>
				<GoalsList />
				{context.token && (
					<div onClick={openModal} className={`right waves-effect waves-light btn-floating ${iconColor}`}>
						<i className='material-icons'>add</i>
					</div>
				)}
			</div>
		</>
	);
};

export default Goals;
