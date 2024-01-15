import React, { Component, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import mapboxgl from '!mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import StationInfo from "../Lantai_station_info.json"


mapboxgl.accessToken ='pk.eyJ1IjoicGF1aTA2MTUiLCJhIjoiY2xlZmNmNXJ1MHA1bDQ0cXFhbG84azk5biJ9.1zHF1ODeOfre40MPt1grdg';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(121.52);
    const [lat, setLat] = useState(24.53);
    const [zoom, setZoom] = useState(9);
    useEffect(() =>{
        if (map.current) return;
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [lng, lat],
        maxBounds: [[121.45, 24.45] ,[121.6, 24.65]],
        zoom:14,
        pitch: 30, // pitch in degrees
      bearing: 0, // bearing in degrees   
      });
      });
  
  
  
  useEffect(() => {
    if (!map.current) return;

    map.current.on('style.load', () => {
      const demSource = map.current.getSource('mapbox-dem');
      if (!demSource) {
      map.current.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
      });
      // add the DEM source as a terrain layer with exaggerated height
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      }});

    map.current.on('load', function(){  
      const existingSource = map.current.getSource('Lantaistation');
      if (!existingSource) {
        map.current.addSource('Lantaistation',{
          'type': 'geojson',
          'data': StationInfo
        
      });
      map.current.addLayer({
        'id':'station-points',
        'type':'circle',
        'source':'Lantaistation',
        'paint':{
          'circle-radius':6,
          'circle-color':'red',
          'circle-pitch-scale':'map',
        },
        'layout':{'visibility': 'visible',},
        })
    
        map.current.addLayer({
        'id':'station-labels',
        'type':'symbol',
        'source':'Lantaistation',
        'layout':{
          'visibility': 'visible',
          'text-field': ['get', 'Name'],
          'text-font': [
          'Open Sans Semibold',
          'Arial Unicode MS Bold',
        ],
          'text-offset':[2.0,1.25],
          'text-variable-anchor': ['top'],
          'text-justify': 'auto',
          'text-size':16.0

        }
        });

      }

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
        });
      map.current.on('mouseenter', 'station-points', (e) => {
          map.current.getCanvas().style.cursor = 'pointer';
        // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;
          console.log(description)
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;}
          console.log(coordinates)
          popup.setLngLat(coordinates).setHTML(description).addTo(map.current)
          });
             
    
        map.current.on('mouseleave', 'station-points', () => {
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
    


      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
        });
    });
  });


    return (
        <>
        <div>
        <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>

          <div ref={mapContainer} style={{ width: '99%', height: '50vh' }}/>
        </div>
        </>
      );
    }