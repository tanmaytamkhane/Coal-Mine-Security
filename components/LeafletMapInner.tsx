'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CoalfieldZone } from '../types';
import { INITIAL_SENSOR_NODES } from '../lib/constants';

interface LeafletMapInnerProps {
  selectedZone: CoalfieldZone;
}

function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 14, { duration: 1.2 });
  }, [coords, map]);
  return null;
}

export default function LeafletMapInner({ selectedZone }: LeafletMapInnerProps) {
  const position: [number, number] = [selectedZone.lat, selectedZone.lng];

  // Custom stylish safety-orange pulsing icon for the mine center
  const centerIcon = L.divIcon({
    className: 'custom-mine-pin',
    html: '<div style="background:#f95721;width:24px;height:24px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 0 15px rgba(249,87,33,0.8);display:flex;align-items:center;justify-content:center;"><div style="width:6px;height:6px;background:white;border-radius:50%;"></div></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // Sensor node pin
  const sensorIcon = L.divIcon({
    className: 'custom-sensor-pin',
    html: '<div style="background:#3b82f6;width:14px;height:14px;border-radius:50%;border:2px solid #ffffff;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <ChangeMapView coords={position} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Subsidence Hazard Zone Radius */}
      <Circle
        center={position}
        radius={650}
        pathOptions={{
          color: '#f95721',
          fillColor: '#f95721',
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '5, 5'
        }}
      />

      {/* Mine Center Marker */}
      <Marker position={position} icon={centerIcon}>
        <Popup>
          <div className="p-1 text-xs">
            <strong className="text-sm text-gray-900">{selectedZone.name}</strong>
            <p className="text-gray-600 mt-1">Strata: {selectedZone.strataType}</p>
            <p className="text-safety-600 font-bold mt-0.5">{selectedZone.activeNodes} Telemetry Nodes Active</p>
          </div>
        </Popup>
      </Marker>

      {/* Sensor Nodes scattered around colliery */}
      {INITIAL_SENSOR_NODES.map((sensor, idx) => {
        const offsetLat = (idx % 3 === 0 ? 0.003 : idx % 3 === 1 ? -0.002 : 0.001) * ((idx % 2 === 0 ? 1 : -1) * (idx + 1) * 0.4);
        const offsetLng = (idx % 2 === 0 ? 0.0025 : -0.003) * ((idx + 1) * 0.35);
        const sensorPos: [number, number] = [selectedZone.lat + offsetLat, selectedZone.lng + offsetLng];

        return (
          <Marker key={sensor.id} position={sensorPos} icon={sensorIcon}>
            <Popup>
              <div className="p-1 text-xs">
                <strong className="text-gray-900 block">{sensor.name}</strong>
                <span className="text-[10px] text-gray-500 font-mono">ID: {sensor.id}</span>
                <p className="text-gray-600 mt-1">Depth: {sensor.depthMeters}m ({sensor.location})</p>
                <p className="text-blue-600 font-semibold mt-0.5">Value: {sensor.currentValue} {sensor.unit}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
