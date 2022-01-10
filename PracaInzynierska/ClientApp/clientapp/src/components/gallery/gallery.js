import React from 'react'
import { Redirect } from 'react-router-dom'
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

import './gallery.css'

class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            monumentId: props.location.state.monumentId,
            monumentName: props.location.state.monumentName,
            images: [],
            isOldPhotos: props.location.state.isOldPhotos,
        }
    }

    componentDidMount() {
        if(this.state.isOldPhotos) {
            this.getOldPhotos();
        }
        else {
            this.getNewPhotos();
        }
    }

    async getNewPhotos() {
        await fetch("https://localhost:44357/api/photo/getnewphotos/" + this.state.monumentId)
            .then(response => response.json())
            .then(data => {
                data.forEach(photo => {
                    this.state.images.push({
                        original: "data:image/jpeg;base64," + photo.picture,
                        thumbnail: "data:image/jpeg;base64," + photo.picture,
                        description: "Źródło:" + photo.source
                    })
                })
                this.setState({
                    
                })
            })
    }

    async getOldPhotos() {
        await fetch("https://localhost:44357/api/photo/getoldphotos/" + this.state.monumentId)
            .then(response => response.json())
            .then(data => {
                data.forEach(photo => {
                    this.state.images.push({
                        original: "data:image/jpeg;base64," + photo.picture,
                        thumbnail: "data:image/jpeg;base64," + photo.picture,
                        description: "Źródło: " + photo.source
                    })
                })
                this.setState({
                    
                })
            })
    }

    getImages = () => {
        let images = [];
        images.push({
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
        })
        
    }

    render() {
        return (
            <div class="center-content">
                <div className="container-fluid">
                    <div className="row">
                        <div style={{display: "flex", justifyContent: "center", width: "100%", marginBottom: "20px"}}>
                            <label style={{fontSize: "26px", fontWeight: "bold"}}>{this.state.isOldPhotos ? "Historyczne zdjęcia" : "Współczesne zdjęcia"} zabytku: "{this.state.monumentName}"</label>
                        </div>
                    </div>
                    <div className="row" style={{display: "flex", justifyContent: "center"}}>
                        <ImageGallery
                            items={this.state.images}
                            autoPlay={false}
                            showPlayButton={false}
                            thumbnailPosition="top"
                            showFullscreenButton={false}
                            showIndex={true}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Gallery;