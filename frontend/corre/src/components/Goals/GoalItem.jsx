import React, { useContext, useState } from "react";
import "./GoalItem.css";
import AuthContext from "../../context/auth-context";
import Modal from "../Modal/Modal";

const GoalItem = ({ title, description, miles, start, end, creatorId, creatorName }) => {
	const context = useContext(AuthContext);
	const [detailPanel, setDetailPanel] = useState(false);

	const closeDetailPanel = () => {
		setDetailPanel(false);
	};
	const openDetailPanel = () => {
		setDetailPanel(true);
	};
	const renderDetailModal = () => {
		const startDate = new Date(start).toLocaleDateString();
		const endDate = new Date(end).toLocaleDateString();
		return (
			<Modal
				actionName='Join'
				show={detailPanel}
				withCancel
				withCreate
				withSubtitle
				subtitle={`Created by ${creatorName}`}
				onCancel={closeDetailPanel}
				title={`${title}`}>
				<div className='row '>
					<div className='col s12'>
						<div className='row detail__content'>
							<div className='col s12 '>
								<div className='detail__label'>Description</div>
								<div>{description}</div>
							</div>
						</div>
						<div className='row detail__content'>
							<div className=' col s12'>
								<div className='detail__label'>Miles</div>
								<div>{miles}</div>
							</div>
						</div>
						<div className='row detail__content'>
							<div className='col s12'>
								<div className='detail__label'>Start Date</div>
								<div>{startDate}</div>
							</div>
						</div>
						<div className='row detail__content'>
							<div className='col s12'>
								<div className='detail__label'>End Date</div>
								<div>{endDate}</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	};
	return (
		<li className='collection-item'>
			{renderDetailModal()}
			<div>
				<h1>{title}</h1>
				<h2>Distance: {miles}</h2>
			</div>
			<div>
				{context.userId !== creatorId ? (
					<button onClick={openDetailPanel} className='waves-effect waves-light btn-small blue darken-1 right'>
						View Detail
					</button>
				) : (
					<p>You created this goal.</p>
				)}
			</div>
		</li>
	);
};
export default GoalItem;
