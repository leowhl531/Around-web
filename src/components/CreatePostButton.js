import React, {Component} from 'react';
import { Modal, Button} from 'antd';

import CreatePostForm from "./CreatePostForm";
import {API_ROOT, AUTH_HEADER, POS_KEY, TOKEN_KEY} from "../constants";

class CreatePostButton extends Component {
    state = {
        visible: false,
        confirmLoading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.form.validateFields((err,values) => {
            if (!err){
                console.log('Received values of form:', values);
                //send image info to server;
                const token = localStorage.getItem(TOKEN_KEY);
                const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
                const formData = new FormData();
                formData.set('lat', lat);
                formData.set('lon', lon);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);

                this.setState({
                    confirmLoading: true
                });

                fetch(`${API_ROOT}/post`,{
                    method: 'POST',
                    headers: { Authorization: `${AUTH_HEADER} ${token}`},
                    body: formData

                })
                    .then(response => {
                        if(response.ok){
                            return "ok"
                        }
                        throw new Error('failed in uploading')
                    })
                    .then(data => {
                        console.log('uploading ok')
                        this.setState({
                            visible: false,
                            confirmLoading: false
                        });

                        this.form.resetFields()
                    })
                    .catch(e => {
                        console.log(e);
                    })
            }
        });
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    okText='Create'
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <CreatePostForm ref={this.getFormRef}/>
                </Modal>
            </div>
        );
    }

    getFormRef = (formInstance) => {
        this.form = formInstance;
    }

}

export default CreatePostButton;