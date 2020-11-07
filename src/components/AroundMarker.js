import React, {Component} from 'react';
import {Marker, InfoWindow} from 'react-google-maps';
import blueIcon from '../assets/images/blue-marker.svg';


class AroundMarker extends Component {
    state={
        isOpen: false
    };
    render() {
        const {isOpen} = this.state;
        const {url, user, message, location, type} = this.props.post;
        const {lat, lon} = location;
        const isImagePost = type === 'image';
        const customizedIcon = isImagePost ? undefined : {
            url : blueIcon,
            scaledSize: new window.google.maps.Size(26, 41)
        };
        return (
            <Marker position={{lat: lat, lng : lon}}
                    onClick ={this.handleToggle}
                    icon={customizedIcon}
                    // onMouseOver={isImagePost?this.handleToggle : undefined}
                    // onMouseOut={isImagePost? this.handleToggle : undefined}
            >
                {
                    this.state.isOpen ? (
                        <InfoWindow>
                            <div>{
                                isImagePost ? <img src={url} alt={message} className="around-marker-image"/>
                                :
                                    <video src={url} controls className="around-marker-video"/>
                            }

                                <p>{`${user}:${message}`}</p>
                            </div>
                        </InfoWindow>
                    ): null
                }
            </Marker>
        );
    }
    handleToggle =() => {
        this.setState((prevState) => ({isOpen : !prevState.isOpen}))
    }

}

export default AroundMarker;