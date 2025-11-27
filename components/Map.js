'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon
const iconFix = () => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

export default function Map({ busLocation }) {
    useEffect(() => {
        iconFix();
    }, []);

    const defaultCenter = [31.9539, 35.9106]; // Amman, Jordan
    const position = busLocation ? [busLocation.latitude, busLocation.longitude] : defaultCenter;

    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {busLocation && (
                <Marker position={position}>
                    <Popup>
                        موقع الباص <br />
                        {new Date(busLocation.updatedAt).toLocaleTimeString()}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
