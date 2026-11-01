import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Bike,
  Clock,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";
import { playStatusDing } from "../utils/sound";

// Default coordinates: Addis Ababa delivery corridor (Bole -> Kazanchis)
// Can be customized based on coordinates or order destination
const RESTAURANT_COORDS = [9.0084, 38.7892]; // Delivo Kitchen Hub, Bole
const CUSTOMER_COORDS = [9.0227, 38.7612];   // Customer Destination, Kazanchis

// Realistic waypoints along city roads between origin and destination
const ROUTE_WAYPOINTS = [
  [9.0084, 38.7892],
  [9.0112, 38.7831],
  [9.0145, 38.7765],
  [9.0178, 38.7712],
  [9.0195, 38.7668],
  [9.0227, 38.7612],
];

// Linear interpolation between waypoints given a progress value 0..1
const interpolatePosition = (progress) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const segments = ROUTE_WAYPOINTS.length - 1;
  const currentSegment = Math.min(Math.floor(clamped * segments), segments - 1);
  const segmentProgress = (clamped * segments) - currentSegment;

  const start = ROUTE_WAYPOINTS[currentSegment];
  const end = ROUTE_WAYPOINTS[currentSegment + 1];

  const lat = start[0] + (end[0] - start[0]) * segmentProgress;
  const lng = start[1] + (end[1] - start[1]) * segmentProgress;

  return [lat, lng];
};

const DeliveryMap = ({ orderStatus = "out_for_delivery", deliveryAddress, customerPhone }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const courierMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const animFrameRef = useRef(null);

  // Status-based initial progress
  const getInitialProgress = (status) => {
    switch (status) {
      case "pending":
      case "confirmed":
        return 0;
      case "preparing":
        return 0.15;
      case "out_for_delivery":
        return 0.65;
      case "delivered":
        return 1.0;
      default:
        return 0.5;
    }
  };

  const [progress, setProgress] = useState(() => getInitialProgress(orderStatus));
  const [isSimulating, setIsSimulating] = useState(false);

  // Update progress when orderStatus prop changes
  useEffect(() => {
    if (!isSimulating) {
      setProgress(getInitialProgress(orderStatus));
    }
  }, [orderStatus, isSimulating]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid double initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: [9.0155, 38.7752],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // High quality CartoDB Positron / OSM tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // 1. Restaurant Marker (Delivo Hub)
    const restaurantIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-green-400 opacity-40"></span>
          <div class="relative flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-xl ring-4 ring-white">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
              <line x1="6" y1="17" x2="18" y2="17"/>
            </svg>
          </div>
          <span class="absolute -bottom-6 whitespace-nowrap rounded-md bg-gray-900/90 px-2 py-0.5 text-[11px] font-bold text-white shadow">
            Delivo Kitchen
          </span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    L.marker(RESTAURANT_COORDS, { icon: restaurantIcon })
      .addTo(map)
      .bindPopup("<b>Delivo Kitchen Central</b><br>Order dispatched from here");

    // 2. Customer Destination Marker
    const customerIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="relative flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-xl ring-4 ring-white">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <span class="absolute -bottom-6 whitespace-nowrap rounded-md bg-gray-900/90 px-2 py-0.5 text-[11px] font-bold text-white shadow">
            Delivery Destination
          </span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    L.marker(CUSTOMER_COORDS, { icon: customerIcon })
      .addTo(map)
      .bindPopup(`<b>Delivery Address:</b><br>${deliveryAddress || "Customer Location"}`);

    // 3. Route Polyline
    routeLineRef.current = L.polyline(ROUTE_WAYPOINTS, {
      color: "#16a34a",
      weight: 5,
      opacity: 0.8,
      dashArray: "8, 8",
    }).addTo(map);

    // Fit bounds smoothly
    map.fitBounds(L.latLngBounds(ROUTE_WAYPOINTS), { padding: [50, 50] });

    // 4. Moving Courier Marker
    const initialPos = interpolatePosition(progress);
    const courierIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-300">
          <span class="absolute inline-flex h-14 w-14 animate-pulse rounded-full bg-emerald-400 opacity-30"></span>
          <div class="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-emerald-400 shadow-2xl ring-4 ring-emerald-500/80">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="15" cy="5" r="1"/>
              <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    courierMarkerRef.current = L.marker(initialPos, { icon: courierIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup("<b>Abebe K. (Delivery Partner)</b><br>On the way with your hot meal! 🛵");

    mapInstanceRef.current = map;

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Courier Marker on Progress change
  useEffect(() => {
    if (!courierMarkerRef.current) return;
    const newCoords = interpolatePosition(progress);
    courierMarkerRef.current.setLatLng(newCoords);
  }, [progress]);

  // Simulation handler
  const toggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    setIsSimulating(true);
    playStatusDing();
    let current = progress >= 1 ? 0 : progress;

    const step = () => {
      current += 0.003;
      if (current >= 1) {
        setProgress(1);
        setIsSimulating(false);
        playStatusDing();
        return;
      }
      setProgress(current);
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setProgress(getInitialProgress(orderStatus));
  };

  // Remaining calculation based on progress
  const distanceRemainingKm = ((1 - progress) * 3.4).toFixed(1);
  const minutesRemaining = Math.max(2, Math.round((1 - progress) * 22));

  return (
    <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-md">
      {/* Map Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Live Delivery Radar</h3>
            <p className="text-xs text-gray-500">Real-time GPS tracking</p>
          </div>
        </div>

        {/* Live Simulation Control */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSimulation}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
              isSimulating
                ? "bg-amber-500 text-white animate-pulse"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <Play className={`h-3.5 w-3.5 ${isSimulating ? "fill-white" : ""}`} />
            {isSimulating ? "Tracking..." : "Simulate Live Route"}
          </button>

          <button
            type="button"
            onClick={resetSimulation}
            title="Reset position"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Map Box */}
      <div className="relative h-72 sm:h-80 w-full bg-gray-100">
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Floating ETA Pill */}
        <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-md border border-gray-100 text-xs">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-green-500 text-white font-bold">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="font-extrabold text-gray-900 leading-tight">
              {progress >= 1 ? "Driver Arrived!" : `~${minutesRemaining} mins away`}
            </p>
            <p className="text-[11px] text-gray-500">
              {progress >= 1 ? "Enjoy your meal" : `${distanceRemainingKm} km remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Driver & Courier Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Courier Abebe"
              className="h-12 w-12 rounded-2xl object-cover ring-2 ring-green-500/30"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80";
              }}
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white ring-2 ring-white">
              <ShieldCheck className="h-3 w-3" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 text-sm">Abebe Kassahun</h4>
              <span className="flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                4.9
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Bike className="h-3.5 w-3.5 text-gray-400" />
              Honda Wave 125 • <span className="font-mono font-semibold text-gray-700">ET-AA-38914</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="tel:+251911234567"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-xs font-bold text-green-700 hover:bg-green-100 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            Call Courier
          </a>
          <button
            type="button"
            onClick={() => {
              if (mapInstanceRef.current && courierMarkerRef.current) {
                mapInstanceRef.current.panTo(courierMarkerRef.current.getLatLng(), { animate: true });
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <MapPin className="h-3.5 w-3.5 text-green-600" />
            Recenter
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
