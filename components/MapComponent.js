"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix for default marker icon issue in Leaflet
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
const defaultIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const locations = [
  { name: "Holiday Home Mumbai", address: "Colaba, Mumbai, India", category: "Holiday Home" },
  { name: "VOF Delhi", address: "Connaught Place, New Delhi, India", category: "VOF" },
  { name: "VEF Kolkata", address: "Park Street, Kolkata, India", category: "VEF" },
  { name: "Office Bangalore", address: "MG Road, Bangalore, India", category: "Office" },
];

const categoryColors = {
  "Holiday Home": "red",
  "VOF": "blue",
  "VEF": "green",
  "Office": "orange",
};

export default function LocationMap() {
  const [mappedLocations, setMappedLocations] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const updatedLocations = await Promise.all(
        locations.map(async (loc) => {
          try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
              params: { q: loc.address, format: "json", limit: 1 },
            });
            if (response.data.length > 0) {
              return { ...loc, lat: response.data[0].lat, lon: response.data[0].lon };
            }
          } catch (error) {
            console.error("Error fetching geolocation:", error);
          }
          return null;
        })
      );
      setMappedLocations(updatedLocations.filter(Boolean));
    };

    fetchCoordinates();
  }, []);

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <LayersControl position="topright">
        {Object.keys(categoryColors).map((category) => (
          <LayersControl.Overlay key={category} checked name={category}>
            <LayerGroup>
              {mappedLocations
                .filter((loc) => loc.category === category)
                .map((loc, index) => (
                  <Marker
                    key={index}
                    position={[parseFloat(loc.lat), parseFloat(loc.lon)]}
                    icon={defaultIcon}
                  >
                    <Popup>{loc.name}</Popup>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
}

