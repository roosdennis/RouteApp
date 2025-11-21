import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPreview = ({ track, instructions }) => {
    if (!track || track.length === 0) return null;

    const center = [track[0].lat, track[0].lon];
    const positions = track.map(p => [p.lat, p.lon]);

    return (
        <div className="w-full h-96 mt-6 rounded-lg overflow-hidden shadow-lg border border-gray-200 print:hidden">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Polyline positions={positions} color="blue" weight={4} />

                {instructions && instructions.map(inst => (
                    <Marker key={inst.id} position={[inst.point.lat, inst.point.lon]}>
                        <Popup>
                            {inst.text} ({Math.round(inst.angle)}°)
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPreview;
