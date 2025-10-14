import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { setMapBounds } from '../store/mapSlice';
import { setSelectedParcel } from '../store/parcelsSlice';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const dispatch = useDispatch();

  const { center, zoom } = useSelector((state) => state.map);
  const { items: parcels, selectedParcel } = useSelector((state) => state.parcels);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (map.current) return;

    if (!MAPBOX_TOKEN) {
      console.error('❌ Mapbox token is missing! Check your .env file');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-117.0, 38.8], // Center of Nevada
      zoom: 5.5,
      minZoom: 5.5,
      maxZoom: 18,
      maxBounds: [
        [-122.0, 34.5], // Southwest - prevent panning too far
        [-112.0, 43.0]  // Northeast - prevent panning too far
      ],
      renderWorldCopies: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Mark map as loaded
      setMapLoaded(true);

      // Add Nevada state boundary - elegant approach
      map.current.addSource('nevada-boundary', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-120.0, 42.0], [-120.0, 39.0], [-119.0, 39.0], [-119.0, 38.5],
              [-118.5, 38.5], [-118.0, 38.0], [-117.0, 37.0], [-116.5, 36.5],
              [-116.0, 36.0], [-115.0, 36.0], [-114.05, 36.0], [-114.05, 37.0],
              [-114.05, 38.0], [-114.05, 39.0], [-114.05, 40.0], [-114.05, 41.0],
              [-114.05, 42.0], [-120.0, 42.0]
            ]]
          }
        }
      });

      // Mask everything outside Nevada - complete coverage
      map.current.addSource('outside-nevada', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              // Outer ring (entire world)
              [[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]],
              // Inner ring (Nevada boundary - creates a hole to show Nevada)
              [[-120.0, 42.0], [-114.05, 42.0], [-114.05, 41.0], [-114.05, 40.0],
               [-114.05, 39.0], [-114.05, 38.0], [-114.05, 37.0], [-114.05, 36.0],
               [-115.0, 36.0], [-116.0, 36.0], [-116.5, 36.5], [-117.0, 37.0],
               [-118.0, 38.0], [-118.5, 38.5], [-119.0, 38.5], [-119.0, 39.0],
               [-120.0, 39.0], [-120.0, 42.0]]
            ]
          }
        }
      });

      // Completely hide everything outside Nevada
      map.current.addLayer({
        id: 'outside-nevada-mask',
        type: 'fill',
        source: 'outside-nevada',
        paint: {
          'fill-color': '#E8E8E8', // Light neutral background
          'fill-opacity': 1, // Completely opaque
        },
      });

      // Hide all labels (cities, states, etc.) outside Nevada
      const layers = map.current.getStyle().layers;
      layers.forEach((layer) => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          // Hide all text labels everywhere (we'll only show Nevada labels by default)
          map.current.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });

      // Nevada border - on top of everything
      map.current.addLayer({
        id: 'nevada-border',
        type: 'line',
        source: 'nevada-boundary',
        paint: {
          'line-color': '#1e40af', // Darker professional blue
          'line-width': 3,
          'line-opacity': 0.9,
        },
      });

      // Add parcels source
      map.current.addSource('parcels', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Add parcels fill layer
      map.current.addLayer({
        id: 'parcels-fill',
        type: 'fill',
        source: 'parcels',
        paint: {
          'fill-color': [
            'match',
            ['get', 'use_type'],
            'Housing Development', '#FF6B6B',
            'Conservation', '#4ECDC4',
            'Recreation', '#45B7D1',
            'Economic Development', '#9B59B6',
            '#95E1D3', // default
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.85,
            0.7,
          ],
        },
      });

      // Add parcels outline layer
      map.current.addLayer({
        id: 'parcels-outline',
        type: 'line',
        source: 'parcels',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 3,
          'line-opacity': 0.9,
        },
      });

      // Add a second darker outline for contrast
      map.current.addLayer({
        id: 'parcels-outline-dark',
        type: 'line',
        source: 'parcels',
        paint: {
          'line-color': '#000000',
          'line-width': 5,
          'line-opacity': 0.6,
        },
      });

      // Add labels for parcels
      map.current.addLayer({
        id: 'parcels-labels',
        type: 'symbol',
        source: 'parcels',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 14,
          'text-anchor': 'center',
          'text-offset': [0, 0],
        },
        paint: {
          'text-color': '#000000',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2,
          'text-halo-blur': 1,
        },
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'parcels-fill', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';

        // Add popup preview on hover
        if (e.features.length > 0) {
          const feature = e.features[0];
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 15
          })
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="padding: 4px 8px;">
                <strong>${feature.properties.name}</strong><br/>
                <span style="font-size: 12px;">${feature.properties.county} County</span>
              </div>
            `)
            .addTo(map.current);

          // Store popup reference to remove on mouseleave
          map.current._hoverPopup = popup;
        }
      });

      map.current.on('mouseleave', 'parcels-fill', () => {
        map.current.getCanvas().style.cursor = '';

        // Remove hover popup
        if (map.current._hoverPopup) {
          map.current._hoverPopup.remove();
          map.current._hoverPopup = null;
        }
      });

      // Handle parcel clicks
      map.current.on('click', 'parcels-fill', (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          dispatch(setSelectedParcel(feature.properties));
        }
      });

      // Update bounds on move
      map.current.on('moveend', () => {
        const bounds = map.current.getBounds();
        dispatch(
          setMapBounds([
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth(),
          ])
        );
      });
    });

    // Cleanup function - properly remove map on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [dispatch]);

  // Update parcels data when it changes
  useEffect(() => {
    if (mapLoaded && map.current && map.current.getSource('parcels')) {
      const features = parcels.map((parcel) => ({
        type: 'Feature',
        properties: {
          id: parcel.id,
          name: parcel.name,
          county: parcel.county,
          acres: parcel.acres,
          use_type: parcel.use_type,
          bill_name: parcel.bill_name,
        },
        geometry: parcel.geometry,
      }));

      map.current.getSource('parcels').setData({
        type: 'FeatureCollection',
        features: features,
      });
    }
  }, [parcels, mapLoaded]);

  // Fly to selected parcel
  useEffect(() => {
    if (mapLoaded && map.current && selectedParcel && selectedParcel.geometry) {
      const coordinates = selectedParcel.geometry.coordinates[0][0];
      if (coordinates && coordinates.length > 0) {
        map.current.flyTo({
          center: coordinates[0],
          zoom: 12,
          duration: 1500,
        });
      }
    }
  }, [selectedParcel, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <p className="text-red-600 font-bold mb-2">⚠️ Mapbox Token Missing</p>
            <p className="text-sm text-gray-600">
              Please add VITE_MAPBOX_TOKEN to your frontend/.env file
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
