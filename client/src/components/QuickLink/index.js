import React, { Component } from "react";
import PropTypes from "prop-types";
import { RaisedButton, Card } from "material-ui";
import { Link } from "react-router-dom";
import DashIcon from "material-ui/svg-icons/action/dashboard";

import styles from "./styles.scss";

// add images and finish layout of 2x2 for each cta
export default function QuickLink(routeObject) {
	let { img, route } = routeObject.route;
	return (
		<div className="dashboard-cta col-md-3">
			<Link to={`/dashboard/${route}`}>
				<Card className="card">
					<img src="" alt={`${route} icon`} />
					<h4>{route}</h4>
				</Card>
			</Link>
		</div>
	);
}

QuickLink.defaultProps = {
	routeObject: {
		img: "",
		route: "test"
	}
};

QuickLink.propTypes = {
	routeObject: PropTypes.object
};