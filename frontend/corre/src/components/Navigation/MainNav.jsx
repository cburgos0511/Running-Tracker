import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/auth-context";
const MainNav = () => (
	<AuthContext.Consumer>
		{context => {
			return (
				<nav>
					<div className='nav-wrapper blue darken-1'>
						<NavLink to='/auth' className='brand-logo corre'>
							Corre
						</NavLink>
						<ul id='nav-mobile' className='right hide-on-med-and-down main-nav__items'>
							<li>
								<NavLink to='/goals'>Goals</NavLink>
							</li>

							<li>
								<NavLink to='/runs'>Runs</NavLink>
							</li>
							{context.token && (
								<>
									<li>
										<NavLink to='/account'>Account</NavLink>
									</li>
									<li>
										<NavLink onClick={context.logout} to='/auth'>
											Logout
										</NavLink>
									</li>
								</>
							)}
							{!context.token && (
								<li>
									<NavLink to='/auth'>Authenticate</NavLink>
								</li>
							)}
						</ul>
					</div>
				</nav>
			);
		}}
	</AuthContext.Consumer>
);

export default MainNav;
