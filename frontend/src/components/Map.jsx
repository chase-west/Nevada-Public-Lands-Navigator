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
        [-121.0, 34.0], // Southwest - prevent panning too far
        [-113.0, 43.0]  // Northeast - prevent panning too far
      ],
      renderWorldCopies: false,
      attributionControl: false, // Remove default attribution to reposition it
    });

    // Add navigation controls (zoom buttons) to top-right
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add attribution to bottom-left (away from our sidebar toggle button)
    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: ''
    }), 'bottom-left');

    map.current.on('load', () => {
      // Mark map as loaded
      setMapLoaded(true);

      // Add Nevada state boundary - reference only, no masking
      map.current.addSource('nevada-boundary', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[
              // Simplified but accurate Nevada boundary
              [-120.0, 42.0],
              [-114.04, 42.0],
              [-114.04, 41.0],
              [-114.04, 37.0],
              [-114.04, 36.0],
              [-114.7, 35.0],
              [-115.0, 36.0],
              [-116.0, 36.0],
              [-117.0, 37.0],
              [-118.0, 38.0],
              [-119.5, 39.0],
              [-120.0, 39.0],
              [-120.0, 42.0]
            ]]
          }
        }
      });

      // Nevada border - visual reference only
      map.current.addLayer({
        id: 'nevada-border',
        type: 'line',
        source: 'nevada-boundary',
        paint: {
          'line-color': '#0d0f10',
          'line-width': 2,
          'line-opacity': 0.4,
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

  // Fly to search location when center/zoom changes from Redux
  useEffect(() => {
    if (mapLoaded && map.current) {
      const currentCenter = map.current.getCenter();
      const currentZoom = map.current.getZoom();

      // Only fly if the center has actually changed (to avoid infinite loops)
      const centerChanged = Math.abs(currentCenter.lng - center[0]) > 0.01 ||
                           Math.abs(currentCenter.lat - center[1]) > 0.01;
      const zoomChanged = Math.abs(currentZoom - zoom) > 0.1;

      if (centerChanged || zoomChanged) {
        map.current.flyTo({
          center: center,
          zoom: zoom,
          duration: 1500,
        });
      }
    }
  }, [center, zoom, mapLoaded]);

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
