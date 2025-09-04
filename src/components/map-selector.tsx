"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components with ssr disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface MapLocation {
  state: string | null;
  municipality: string | null;
  neighborhood: string | null;
  full_address: string;
  state_id: number | null;
  municipality_id: number | null;
  neighborhood_id: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface MapSelectorProps {
  onLocationSelect: (location: MapLocation | null) => void;
  initialLocation?: { lat: number; lng: number };
}

export function MapSelector({ onLocationSelect, initialLocation }: MapSelectorProps) {
  // Default to Mexico City coordinates
  const defaultCenter: [number, number] = [19.4326, -99.1332];
  const defaultZoom = 5;
  
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  );
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<any>(null);

  // Set isClient to true only on client
  useEffect(() => {
    setIsClient(true);
    
    // Leaflet icon fix (only run on client)
    const L = require('leaflet');
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
      if (response.ok) {
        const data = await response.json();
        setAddress(data.address || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
        // Pass the location data to parent component, including coordinates
        const locationData = {
          ...data.location,
          latitude: lat,
          longitude: lng
        };
        onLocationSelect(locationData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al obtener la dirección");
        setAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
        // Pass the coordinates even if reverse geocoding fails
        onLocationSelect({
          state: null,
          municipality: null,
          neighborhood: null,
          full_address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
          state_id: null,
          municipality_id: null,
          neighborhood_id: null,
          latitude: lat,
          longitude: lng
        });
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setError("Error de conexión al obtener la dirección");
      setAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      // Pass the coordinates even if reverse geocoding fails
      onLocationSelect({
        state: null,
        municipality: null,
        neighborhood: null,
        full_address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
        state_id: null,
        municipality_id: null,
        neighborhood_id: null,
        latitude: lat,
        longitude: lng
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to geocode address to coordinates
  const geocodeAddress = async (address: string) => {
    if (address.trim() === "") {
      setError("Por favor ingrese una dirección");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.lat && data.lng) {
          const newPosition: [number, number] = [data.lat, data.lng];
          setPosition(newPosition);
          
          // Call reverse geocode to get structured location data
          reverseGeocode(data.lat, data.lng);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "No se encontró la dirección");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      setError("Error de conexión al buscar la dirección");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle address input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setError(null);
    
    // If user clears the address, clear the marker
    if (value.trim() === "") {
      setPosition(null);
      onLocationSelect(null);
    }
  };

  // Handle address input blur to trigger geocoding
  const handleAddressBlur = () => {
    if (address.trim() !== "") {
      geocodeAddress(address);
    }
  };

  // Handle Enter key in address input
  const handleAddressKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (address.trim() !== "") {
        geocodeAddress(address);
      }
    }
  };

  // Handle map click
  const handleMapClick = (e: any) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  // Render map only on client
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="address-input" className="text-sm font-medium">
            Dirección *
          </label>
          <input
            id="address-input"
            type="text"
            value={address}
            onChange={handleAddressChange}
            onBlur={handleAddressBlur}
            onKeyDown={handleAddressKeyPress}
            placeholder="Ingresa la dirección de la propiedad"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {isLoading && (
            <p className="text-sm text-gray-500">Buscando dirección...</p>
          )}
        </div>
        
        <div className="h-96 w-full relative border border-gray-300 rounded-md overflow-hidden">
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            Cargando mapa...
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Haz clic en el mapa para seleccionar la ubicación de la propiedad o ingresa una dirección
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="address-input" className="text-sm font-medium">
          Dirección *
        </label>
        <input
          id="address-input"
          type="text"
          value={address}
          onChange={handleAddressChange}
          onBlur={handleAddressBlur}
          onKeyDown={handleAddressKeyPress}
          placeholder="Ingresa la dirección de la propiedad"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {isLoading && (
          <p className="text-sm text-gray-500">Buscando dirección...</p>
        )}
      </div>
      
      <div className="h-96 w-full relative border border-gray-300 rounded-md overflow-hidden">
        <MapContainer
          center={position || defaultCenter}
          zoom={position ? 15 : defaultZoom}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          whenReady={(map: any) => {
            // Add click handler when map is ready
            map.target.on('click', handleMapClick);
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {position && (
            <Marker position={position}>
              <Popup>
                {address || `Lat: ${position[0].toFixed(6)}, Lng: ${position[1].toFixed(6)}`}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      <p className="text-sm text-gray-500">
        Haz clic en el mapa para seleccionar la ubicación de la propiedad o ingresa una dirección
      </p>
    </div>
  );
}