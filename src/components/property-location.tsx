"use client";

import { useState, useEffect } from "react";
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

interface PropertyLocationProps {
  latitude: number;
  longitude: number;
  address: string;
  zoom?: number;
}

export function PropertyLocation({ latitude, longitude, address, zoom = 15 }: PropertyLocationProps) {
  const [showMap, setShowMap] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true only on client
  useEffect(() => {
    setIsClient(true);
    
    // Fix for Leaflet icons
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    }
  }, []);

  // Generate static map URL (using OpenStreetMap)
  // Format: https://staticmap.openstreetmap.de/staticmap.php?center=lat,lng&zoom=15&size=600x400&maptype=mapnik&markers=lat,lng,red
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=600x400&maptype=mapnik&markers=${latitude},${longitude},red`;

  if (!showMap) {
    return (
      <div className="w-full h-96 relative cursor-pointer" onClick={() => setShowMap(true)}>
        <img 
          src={staticMapUrl} 
          alt={`Ubicación de la propiedad: ${address}`}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            // Fallback to a placeholder if the image fails to load
            e.currentTarget.src = "https://via.placeholder.com/600x400/cccccc/000000?text=Mapa+de+Ubicación";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
            <p className="text-gray-800 font-medium">Haz clic para ver el mapa interactivo</p>
          </div>
        </div>
      </div>
    );
  }

  // Render map only on client
  if (!isClient) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p>Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 relative rounded-lg overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}