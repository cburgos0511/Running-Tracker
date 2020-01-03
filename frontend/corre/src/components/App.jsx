import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Auth from "./pages/Auth";
import Goals from "./pages/Goals";
import Participants from "./pages/Account";
import Runs from "./pages/Runs";
import MainNav from "./Navigation/MainNav";
import AuthContext from "../context/auth-context";

export default class App extends Component {
	state = {
		token: null,
		userId: null,
	};
	login = (token, userId, userExpiration) => {
		this.setState({
			token: token,
			userId: userId,
		});
	};

	logout = () => {
		this.setState({
			token: null,
			userId: null,
		});
	};

	render() {
		const client = new ApolloClient({
			uri: "http://localhost:4000/graphql",
		});
		return (
			<ApolloProvider client={client}>
				<BrowserRouter>
					<AuthContext.Provider value={{ token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout }}>
						<Route
							render={({ location }) => (
								<TransitionGroup>
									<CSSTransition key={location.key} timeout={150} classNames='fade'>
										<div id='pages'>
											<MainNav />

											<Switch location={location}>
												{this.state.token && <Redirect from='/' to='/goals' exact />}
												{this.state.token && <Redirect from='/auth' to='/goals' exact />}
												{!this.state.token && <Route path='/auth' component={Auth} />}
												<Route path='/runs' component={Runs} />
												<Route path='/goals' component={Goals} />
												<Route path='/account' component={Participants} />

												{!this.state.token && <Redirect from='/' to='/auth' exact />}
											</Switch>
										</div>
									</CSSTransition>
								</TransitionGroup>
							)}
						/>
					</AuthContext.Provider>
				</BrowserRouter>
			</ApolloProvider>
		);
	}
}
