import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to fit map bounds to markers
function MapBounds({ routes }) {
    const map = useMap();

    useEffect(() => {
        if (routes && routes.length > 0) {
            const bounds = L.latLngBounds(
                routes.map((route) => [route.lat, route.lng]),
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [routes, map]);

    return null;
}

export default function RouteMap({ routes = [], deliveries = [] }) {
    // Default center (can be customized)
    const defaultCenter = [12.8797, 121.774]; // Philippines center
    const defaultZoom = 6;

    // Create marker icon for delivery locations
    const deliveryIcon = new L.Icon({
        iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    // Create route positions array for polylines
    const routePositions =
        routes.length > 0 ? routes.map((route) => [route.lat, route.lng]) : [];

    return (
        <div className="h-[500px] w-full rounded-lg overflow-hidden">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Display delivery markers */}
                {deliveries.map((delivery, index) => (
                    <Marker
                        key={`delivery-${index}`}
                        position={[delivery.lat, delivery.lng]}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong className="block mb-1">
                                    {delivery.name || "Delivery Location"}
                                </strong>
                                <p className="mb-1">{delivery.address || ""}</p>
                                <p className="text-gray-600">
                                    Status: {delivery.status || "Unknown"}
                                </p>
                                {delivery.orderId && (
                                    <p className="text-gray-500">
                                        Order: #{delivery.orderId}
                                    </p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Display route line */}
                {routePositions.length > 1 && (
                    <Polyline
                        positions={routePositions}
                        color="#3b82f6"
                        weight={4}
                        opacity={0.7}
                        dashArray="10, 10"
                    />
                )}

                {/* Fit map bounds to show all markers */}
                <MapBounds routes={[...routes, ...deliveries]} />
            </MapContainer>
        </div>
    );
}
