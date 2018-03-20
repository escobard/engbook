import axios from "axios";

import { FETCH_USER, LOGOUT_USER } from "./types";

export const fetchUser = () =>
	// this fetches our user data, which is only present in the API if the user has been authenticated
	// with google, handled by the passport google strategy

	// as a refreshed with redux thunk, the middleware looks for any returned FUNCTIONS
	// within an action creator, handling these first
	/*
		return function(dispatch) {
		axios
			.get(`${server}/api/current_user`)

			// then returns the data via an action creator object
			.then(res => dispatch({ type: FETCH_USER, payload: res }));
	};
	*/
	async dispatch => {
		// grabs the user profile object from the API, attaches it to res.data
		const res = await axios.get("/api/current_user");

		// console.log("RES", res.data);
		// then returns the data via an action creator object
		dispatch({ type: FETCH_USER, payload: res.data });
	};

export const logoutUser = () => async dispatch => {
	const res = await axios.get("/api/logout");
	dispatch({ type: LOGOUT_USER, payload: "" });
};