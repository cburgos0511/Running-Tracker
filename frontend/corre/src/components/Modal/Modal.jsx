import React from "react";
import "./modal.css";

const Modal = ({ show, withCancel, withCreate, children, title, onCancel, onCreate, actionName, withSubtitle, subtitle }) => {
	const showHideClassName = show ? "modal display-block" : "modal display-none";

	return (
		<div className={showHideClassName}>
			<section className='modal__main'>
				<header className='modal__title'>
					<h5>
						{title} {withSubtitle && <span className='subtitle'>{subtitle}</span>}
					</h5>
				</header>
				<div className='modal__content'>{children}</div>
				<div className='modal__actions'>
					{withCancel && (
						<button onClick={onCancel} className='waves-effect waves-light btn red darken-1 right'>
							Cancel
						</button>
					)}
					{withCreate && (
						<button onClick={onCreate} className='waves-effect waves-light btn blue darken-1 right'>
							{actionName}
						</button>
					)}
				</div>
			</section>
		</div>
	);
};
export default Modal;
