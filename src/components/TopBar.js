import React, {Component} from 'react';
import {Icon, Avatar} from "antd";
import logo from "../assets/images/logo.svg";
import {USER} from "../constants";


class TopBar extends Component {
    render() {
        const user = localStorage.getItem(USER);
        return (
            <div>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <span className="App-title">Around</span>
                    {
                        this.props.isLoggedIn ?
                            <p>
                                <a className="logout" onClick={this.props.handleLogout}>
                                    <Icon type="logout" />
                                </a>
                                <a className="avatar">
                                    <Avatar icon="user" />{`${user}`}
                                </a>

                            </p>

                            : null
                    }

                </header>
            </div>
        );
    }
}

export default TopBar;