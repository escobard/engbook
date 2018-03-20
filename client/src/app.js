import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import { fetchUser } from "./actions";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Dashboard from "./containers/dashboard";
import Home from "./containers/home";
import Account from "./containers/account";
import Profile from "./containers/profile";
import Survey from "./containers/survey";
import Blog from "./containers/blog";

import styles from "./styles/global.scss";

class App extends Component {
    componentDidMount() {
        // fetches our user data from the backend
        this.props.fetchUser();
    }
    render() {
        return (
            <div>
                <Header />
                <div className="container">
                    <Route exact path="/" component={Home} />
                    <Route exact path="/dashboard" component={Dashboard} />
                    <Route
                        exact
                        path="/dashboard/account"
                        component={Account}
                    />
                    <Route
                        exact
                        path="/dashboard/profile"
                        component={Profile}
                    />
                    <Route exact path="/dashboard/survey" component={Survey} />
                    <Route exact path="/dashboard/blog" component={Blog} />
                </div>
                <Footer />
            </div>
        );
    }
}

export default connect(null, { fetchUser })(App);