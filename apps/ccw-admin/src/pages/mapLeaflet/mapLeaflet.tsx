import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon, latLng, marker} from 'leaflet'
// import L from 'leaflet';

const center = {lat:18.52780038894944, lon:73.85745541017891};
 


const MapComponent = () => {

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Fetch latitude and longitude data from your API
    fetch('http://localhost:3000/api/post/all-locations')
      .then((response) => response.json())
      .then((res)=>{setMarkers(res);})
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return(
    <MapContainer center={center} zoom ={12} style={{ width: '100vw', height: '100vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
          {markers.map((value)=>
            <Marker position={value} icon={new Icon({iconUrl: markerIconPng, iconSize: [20, 35], iconAnchor: [12, 41]})} >
            <Popup>
              <h1>Can take the content from /api/post Create post.</h1>
            </Popup>
          </Marker>
          )}

    </MapContainer>
  );
};

export default MapComponent;
