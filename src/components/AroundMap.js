import React, {Component} from 'react';
import {GoogleMap, withGoogleMap, withScriptjs} from "react-google-maps";
import {POS_KEY} from "../constants";
import AroundMarker from "./AroundMarker";

class NormalAroundMap extends Component {
    render() {
        const{ lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap ref={this.getMapRef}
                       defaultZoom={11}
                       defaultCenter={{lat : lat, lng: lon}}
                       onDragEnd={this.reloadMarker}
                       onZoomChanged={this.reloadMarker}
            >
                {
                    this.props.posts.map(
                        post => <AroundMarker post={post} key={post.url}/>)
                }
            </GoogleMap>
        );
    }
    getCenter = () => {
        const center = this.map.getCenter();
        return  {lat : center.lat(), lon: center.lng()}
    }

    getMapRef = (mapInstance) => {
        this.map = mapInstance;
        window.map = mapInstance;
    }

    reloadMarker = () => {
        const center = this.getCenter();
        const radius = this.getRadius();
        this.props.loadPostsByTopic(center, radius);

    }

    getRadius = () => {
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if(center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());
            console.log('ne ->', ne , 'right ->', right );
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
    }


}


}

const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));
export default AroundMap;