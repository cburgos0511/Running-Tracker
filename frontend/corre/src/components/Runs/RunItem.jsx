import React, { useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import FETCH_USER from "../../queries/fetchUser";
import AuthContext from "../../context/auth-context";

const DELETE_RUN = gql`
	mutation DeleteRun($runId: ID!) {
		deleteRun(runId: $runId) {
			_id
			miles
		}
	}
`;

const RunItem = ({ id, mile, hour, minute, second, date }) => {
	const { userId } = useContext(AuthContext);
	const [deleteRun] = useMutation(DELETE_RUN);

	let hr = hour === null ? 0 : hour;
	let min = minute === null ? 0 : minute;
	let sec = second === null ? 0 : second;

	const avePace = (mile, hr, min, sec) => {
		//conver everything to minutes
		hr = hr * 60;
		sec = sec / 60;
		let totalMin = min + hr + sec;

		return totalMin / mile;
	};

	let pace = avePace(mile, hr, min, sec).toFixed();
	// console.log(pace);

	const getPaceSec = pace => {
		let seconds = 0;
		let strSecOfPace = String(pace).split(".")[1];
		if (strSecOfPace === undefined) {
			return 0;
		} else {
			seconds = Math.round(Number("." + strSecOfPace) * 60);
		}

		return seconds;
	};

	const tablePace = (m, s) => {
		let p;
		if (s < 10) {
			p = m + ":0" + s;
		} else {
			p = m + ":" + s;
		}
		return p;
	};

	const handdleDeleteRun = id => {
		deleteRun({ variables: { runId: id }, refetchQueries: [{ query: FETCH_USER, variables: { userId } }], awaitRefetchQueries: true });
	};

	return (
		<tr>
			<td>{mile}</td>
			<td className='center'>{`${hr}:${min}:${sec}`}</td>
			<td className='center'>{tablePace(pace, getPaceSec(avePace(mile, hr, min, sec)))}</td>
			<td>
				<i onClick={() => handdleDeleteRun(id)} className='material-icons right' id='delete-btn'>
					delete
				</i>
				<i className='material-icons right' id='edit-btn'>
					edit
				</i>
			</td>
		</tr>
	);
};

export default RunItem;
