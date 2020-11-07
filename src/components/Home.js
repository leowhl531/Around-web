import React, {Component} from 'react';
import { Tabs, Spin, Row, Col, Radio} from 'antd';
import CreatePostButton from "./CreatePostButton";
import {
    GEO_OPTIONS,
    POS_KEY,
    API_ROOT,
    AUTH_HEADER,
    TOKEN_KEY,
    POST_TYPE_IMAGE,
    POST_TYPE_UNKNOWN,
    POST_TYPE_VIDEO,
    TOPIC_AROUND, TOPIC_FACE, USER, MY_POST, MAP_URL
} from '../constants'
import Gallery from "./Gallery";
import AroundMap from "./AroundMap";
const { TabPane} = Tabs;


class Home extends Component {
    state = {
        posts: [],
        err: '',
        isLoadingGeo: false,
        isLoadingPosts: false,
        topic: TOPIC_AROUND
    }

    render() {
        // updatePost = {this.renderPosts(type)}
        const operations = <CreatePostButton />
        return (
            <div>
                <Radio.Group onChange={this.handleTopicChange} value={this.state.topic}>
                    <Radio value={TOPIC_AROUND}>Posts Around Me</Radio>
                    <Radio value={TOPIC_FACE}>Faces Around World</Radio>
                    <Radio value={MY_POST}>My Post</Radio>
                </Radio.Group>
                <Tabs tabBarExtraContent={operations}>
                    <TabPane tab="Image Posts" key="1">
                        {this.renderPosts(POST_TYPE_IMAGE)}
                    </TabPane>
                    <TabPane tab="Video Posts" key="2">
                        {this.renderPosts(POST_TYPE_VIDEO)}
                    </TabPane>
                    <TabPane tab="Map" key="3">
                        <AroundMap googleMapURL={MAP_URL}
                                   loadingElement={<div style={{ height: `100%` }} />}
                                   containerElement={<div style={{ height: `600px` }} />}
                                   mapElement={<div style={{ height: `100%` }} />}
                                   posts={this.state.posts}
                                   loadPostsByTopic={this.loadPostsByTopic}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }

    handleTopicChange = (e) => {
        console.log('handleTopicChange ->', e.target.value);
        const topic = e.target.value;
        this.setState({
            topic:topic
        })
        if(topic === TOPIC_AROUND){
            return this.loadNearbyPosts()
        }else if(topic === TOPIC_FACE){
            return this.loadFaceAroundWorld()
        }else{
            return this.loadMyPosts()
        }
    }

    loadPostsByTopic = (center, raius) =>{
        const {topic} = this.state;
        if(topic === TOPIC_AROUND){
            return this.loadNearbyPosts(center, raius)
        }else if(topic === TOPIC_FACE){
            return this.loadFaceAroundWorld()
        }else{
            return this.loadMyPosts()
        }
    }
    loadFaceAroundWorld = () => {
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({
            isLoadingPosts: true,
            err: ''
        });
        return fetch(`${API_ROOT}/cluster?term=face`,{
            method:"GET",
            headers:{
                Authorization: `${AUTH_HEADER} ${token}`
            }
        }).then(response => {
            if(response.ok){
                console.log(response);
                return response.json();
            }
            throw new Error("Failed to load around world")
        }).then( data=>{
            console.log(data);
            this.setState({
                posts:data ? data : [],
                isLoadingPosts: false
            });
        }).catch( err =>{
            console.log(err);
            this.setState({
                err: err.message
            })
        })
    }

    componentDidMount() {
        if("geolocation" in navigator){
            this.setState({
                isLoadingGeo : true
            });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS
            )
        }else{
            this.setState({
                err: 'fetch geolocation failed'
            })
        }
    }
    onSuccessLoadGeoLocation = (position) => {
        console.log(position)
        const { latitude, longitude} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}))
        this.setState({
            isLoadingGeo: false,
            err:''
        })
        this.loadNearbyPosts();
    }
    onFailedLoadGeoLocation = () => {
        console.log('err in location fetching')
        this.setState({
            err: 'fetch geolocation failed'
        })
    }
    loadNearbyPosts = (center, radius) => {
        const {lat, lon} = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 200;
        const token = localStorage.getItem(TOKEN_KEY);

        this.setState({
            isLoadingPosts : true,
            err: ''
        })
        return fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`, {
            method: "GET",
            headers:{Authorization: `${AUTH_HEADER} ${token}`}
        })
            .then(response => {
                if(response.ok){
                    return response.json()
                }
                throw new Error("fetch posts failed")
            })
            .then(data=>{
                console.log(data);
                this.setState({
                    posts: data ? data : [],
                    isLoadingPosts: false
                })
            })
            .catch(err=>{
                console.log("err in fetching posts",err)
                this.setState({
                    err: 'fetch posts failed'
                })
            })
    }
    loadMyPosts =() =>{
        const user = localStorage.getItem(USER);
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({
            isLoadingPosts: true,
            err: ''
        });
        return fetch(`${API_ROOT}/mypost?user=${user}`, {
            method: "GET",
            headers:{Authorization: `${AUTH_HEADER} ${token}`}
        })
            .then(response => {
                if(response.ok){
                    return response.json()
                }
                throw new Error("fetch posts failed")
            })
            .then(data=>{
                console.log(data);
                this.setState({
                    posts: data ? data : [],
                    isLoadingPosts: false
                })
            })
            .catch(err=>{
                console.log("err in fetching posts",err)
                this.setState({
                    err: 'fetch posts failed'
                })
            })

    }
    renderPosts = (type) => {
        //step1 : data
        const {posts,err, isLoadingGeo, isLoadingPosts} = this.state;

        //err
        if(err){
            return err;
        }else if(isLoadingGeo){
            //load geolocation
            return <Spin tip="Loading GEO location"/>
        }else if(isLoadingPosts){
            //load geolocation
            return <Spin tip="Loading posts"/>
        }else if(posts.length > 0){
            //load posts
            // const images = posts.map(post => {
            //     return {
            //         src: post.url,
            //         user: post.user,
            //         thumbnailWidth: 200,
            //         thumbnailHeight: 300,
            //         caption : post.message,
            //         thumbnail: post.url,
            //     }
            // });
            // return <Gallery images={images}/>
            return type === POST_TYPE_IMAGE ? this.renderImagePosts()
                : this.renderVideoPost();
        }else {
            return 'no posts';
        }
    }

    renderImagePosts = () => {
        const{ posts} = this.state;
        const images = posts.filter( post => post.type === POST_TYPE_IMAGE).map( post => {
            // console.log("post->",post);
            const newImage = new Image();
            // newImage.setAttribute("crossOrigin", "Anonymous");
            // newImage.src= post.url;
            // var height = 200;
            // var width = 200;
            // newImage.onLoad = () =>{
            //     height = newImage.height;
            //     width = newImage.width;
            // }
            return {

                src: post.url,
                user: post.user,
                // thumbnailWidth: width,
                // thumbnailHeight: height,
                caption : post.message,
                thumbnail: post.url,
            }
        })
        return <Gallery images={images}/>;
    }
    renderVideoPost = () => {
        const{posts} = this.state;
        return (
            <Row>
                {
                    posts.filter(post => [POST_TYPE_VIDEO, POST_TYPE_UNKNOWN].includes(post.type))
                        .map(post => (
                            <Col key={post.url} span={8}>
                                <video src={post.url}
                                       controls={true}
                                       className="video-block"
                                />
                                <p>{post.user} : {post.message}</p>
                            </Col>
                            )

                        )
                }
            </Row>
        )
    }

    handlePostUpdate = (post) => {
        this.setState({
            posts:[...this.state.posts, post]
        })
    }
}

export default Home;