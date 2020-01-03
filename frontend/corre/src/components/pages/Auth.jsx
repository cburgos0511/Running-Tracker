import React, { Component } from "react";
import AuthContext from "../../context/auth-context";
export default class Auth extends Component {
	state = {
		isLogin: true,
		firstName: "",
		lastName: "",
		age: "",
		email: "",
		password: "",
	};

	static contextType = AuthContext;

	handleSubmit = e => {
		console.log("I have been clicked");

		const { firstName, lastName, age, email, password, isLogin } = this.state;
		e.preventDefault();

		let request = {
			query: `
				query {
					login(email: "${email}", password: "${password}"){
						userId
						token
						tokenExpiration
					}
				}
			`,
		};

		if (!isLogin) {
			request = {
				query: `
				mutation {
					createUser(userInput: {firstName: "${firstName}", lastName: "${lastName}", age: ${age} , email:"${email}", password: "${password}"}){
						_id
						firstName
						lastName
						age
						email
					}
				}
			`,
			};
		}

		fetch("http://localhost:4000/graphql", {
			method: "POST",
			body: JSON.stringify(request),
			headers: {
				"Content-Type": "application/json",
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
				if (resData.data.login.token) {
					this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExperation);
				}
			})
			.catch(err => {
				console.log(err);
			});

		this.setState({
			firstName: "",
			lastName: "",
			age: "",
			email: "",
			password: "",
		});
	};

	renderSignUpForm = () => {
		return (
			<>
				<div className='row'>
					<div className='input-field col s6'>
						<input onChange={e => this.setState({ firstName: e.target.value })} value={this.state.firstName} type='text' id='first_name' className='validate' />
						<label htmlFor='first_name'>First Name</label>
					</div>
					<div className='input-field col s6'>
						<input onChange={e => this.setState({ lastName: e.target.value })} value={this.state.lastName} type='text' id='last_name' className='validate' />
						<label htmlFor='last_name'>Last Name</label>
					</div>
				</div>
				<div className='row'>
					<div className='input-field col s12'>
						<input onChange={e => this.setState({ age: e.target.value })} value={this.state.age} type='text' className='validate' id='age' />
						<label htmlFor='age'>Age</label>
					</div>
				</div>
				<div className='row'>
					<div className='input-field col s12'>
						<input onChange={e => this.setState({ email: e.target.value })} value={this.state.email} type='email' className='validate' id='email' />
						<label htmlFor='email'>Email</label>
						<span className='helper-text' data-error='Must cuntain @email.com' data-success='' />
					</div>
				</div>
				<div className='row'>
					<div className='input-field col s12'>
						<input onChange={e => this.setState({ password: e.target.value })} value={this.state.password} type='password' className='validate' id='password' />
						<label htmlFor='password'>Password</label>
					</div>
				</div>
			</>
		);
	};

	renderLogInForm = () => {
		return (
			<>
				<div className='row'>
					<div className='input-field col s12'>
						<input onChange={e => this.setState({ email: e.target.value })} value={this.state.email} type='email' className='validate' id='email' />
						<label htmlFor='email'>Email</label>
						<span className='helper-text' data-error='Must cuntain @email.com' data-success='' />
					</div>
				</div>
				<div className='row'>
					<div className='input-field col s12'>
						<input onChange={e => this.setState({ password: e.target.value })} value={this.state.password} type='password' className='validate' id='password' />
						<label htmlFor='password'>Password</label>
					</div>
				</div>
			</>
		);
	};

	toggleForms = () => {
		this.setState(prevState => {
			return { isLogin: !prevState.isLogin };
		});
	};

	render() {
		const { isLogin } = this.state;
		return (
			<div className='row container '>
				<h2 className='page-title'>{!isLogin ? "Create a User" : "Login"}</h2>
				<form autoComplete='off' className='col s12 '>
					{!isLogin ? this.renderSignUpForm() : this.renderLogInForm()}
					<div className='btn-center'>
						<button onClick={this.toggleForms} className='btn waves-effect waves-light blue darken-1' type='button'>
							Switch to {isLogin ? "Signup" : "Login"}
							<i className='material-icons right'>replay</i>
						</button>
						<button onClick={this.handleSubmit} className='btn waves-effect waves-light blue darken-1' type='submit'>
							Submit
							<i className='material-icons right'>send</i>
						</button>
					</div>
				</form>
			</div>
		);
	}
}
