import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactGallery from 'react-grid-gallery'
class Gallery extends Component {
    static propTypes = {
        images: PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.string.isRequired,
                src: PropTypes.string.isRequired,
                thumbnail: PropTypes.string,
                caption: PropTypes.string,
                thumbnailWidth: PropTypes.number,
                thumbnailHeight: PropTypes.number
            })
        ).isRequired
    }

    render() {
        const images = this.props.images.map((image) => {
            return {
                ...image,
                customOverlay: (
                    <div className="gallery-thumbnail">
                        <div>{`${image.user}: ${image.caption}`}</div>
                    </div>
                ),
            };
        });

        return (
            <div className="gallery">
                <ReactGallery
                    backdropClosesModal
                    images={images}
                    enableImageSelection={false}/>
            </div>
        );
    }

}

export default Gallery;