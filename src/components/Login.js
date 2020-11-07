import React, {Component} from 'react';
import {Link} from "react-router-dom";

import { Form, Icon, Input, Button, message} from 'antd';
import {API_ROOT, USER} from "../constants";


class NormalLoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                //login
                fetch(`${API_ROOT}/login`,{
                    method: "POST",
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password
                    })
                })
                    .then(response => {
                        if(response.ok) {
                            localStorage.setItem(USER, values.username);
                            console.log("response", response);
                            // this.props.handleLoginSucceed(response.text());
                            return response.text();
                        }else{
                            message.error('no data')
                            return Promise.reject();
                        }
                    })
                    .then(data => {
                        console.log('data ->', data);
                        this.props.handleLoginSucceed(data);
                    })
                    .catch(err => {
                        console.log(err);
                        message.error("Login fail")
                    })
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <Link to="/register">register now!</Link>
                </Form.Item>
            </Form>
        );
    }
}

const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default Login;

