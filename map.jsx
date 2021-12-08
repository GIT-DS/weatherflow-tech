import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const mapCenter = { lat: 37.7758, lng: -122.435 };

class Map extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      lat_min: "",
      lat_max: "",
      lon_min: "",
      lon_max: "", 
      zoom: "",
      units_wind: "mph",
      units_temp: "f",
      units_distance: "mi"
    }
    this.addSpotsMarker = this.addSpotsMarker.bind(this)
  }

  componentDidMount() {

    const map = ReactDOM.findDOMNode(this.refs.map)
    

    const options = {
      center: this.props.center,
      zoom: 13
    };

    this.map = new google.maps.Map(map, options);

    this.listenForMove();
  }

  addSpotsMarker(spot) {

    const pos = new google.maps.LatLng(spot.lat, spot.lon);

    const marker = new google.maps.Marker({
      position: pos,
      map: this.map
    });

    // when the marker is clicked on, alert the name
    // marker.addListener('click', () => {
    //   alert(`clicked on: ${burritoPlace.name}`);
    // });
  }

  listenForMove() {

    google.maps.event.addListener(this.map, 'idle', () => {
      const bounds = this.map.getBounds();
      let southWest = bounds.getSouthWest();
      let northEast = bounds.getNorthEast();

      this.setState({
        lat_min: southWest.lat(),
        lon_min: southWest.lng(),
        lat_max: northEast.lat(),
        lon_max: northEast.lng(),
        zoom: this.map.getZoom(),

      }, ()=> {
        const {lat_min, lat_max, lon_min, lon_max, zoom, units_wind, units_distance, units_temp} = this.state

        axios.get(`https://api.weatherflow.com/wxengine/rest/spot/getSpotDetailSetByZoomLevel?lat_min=${lat_min}&lat_max=${lat_max}&lon_min=${lon_min}&lon_max=${lon_max}&zoom=${zoom}1&wf_token=d66eae2622e5fb8f9f7429b5dcb48a6d&units_wind=${units_wind}&units_temp=${units_temp}&units_distance=${units_distance}`)
        .then(res => res.data.spots.forEach(spot => this.addSpotsMarker(spot), console.log(this.map)))

        }
      )
    })}


  render() {

    return (
      <div>
        <span>Weather Flow Map</span>
        <div id='map' ref='map'/>
      </div>
    );
  }
}

ReactDOM.render(
  <Map center={mapCenter}/>,
  document.getElementById('root')
);
