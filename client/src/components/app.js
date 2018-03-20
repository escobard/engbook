import React, { Component } from "react";
import { Route } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

import Dashboard from "../containers/dashboard";
import Home from "../containers/home";
import Account from "../containers/account";
import Profile from "../containers/profile";
import Survey from "../containers/survey";
import Blog from "../containers/blog";

import styles from "../styles/global.scss";

export default class App extends Component {
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
