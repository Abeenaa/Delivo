import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Navigation,
  Clock,
  MapPin,
  Bike,
  ShieldCheck,
  Phone,
  Play,
  RotateCcw,
  Sparkles,
  Radio,
} from "lucide-react";
import { playStatusDing } from "../utils/sound";

const RESTAURANT_COORDS = [9.0084, 38.7892];
const CUSTOMER_COORDS = [9.0227, 38.7612];

const ROUTE_WAYPOINTS = [
  [9.0084, 38.7892],
  [9.0112, 38.7831],
  [9.0145, 38.7765],
  [9.0178, 38.7712],
  [9.0195, 38.7668],
  [9.0227, 38.7612],
];

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

const getInitialProgress = (status) => {
  switch (status) {
    case "pending":
      return 0.05;
    case "confirmed":
      return 0.15;
    case "preparing":
      return 0.35;
    case "out_for_delivery":
      return 0.72;
    case "delivered":
      return 1.0;
    default:
      return 0.25;
  }
};

const DeliveryMap = ({
  orderStatus = "out_for_delivery",
  deliveryAddress = "Kazanchis, Addis Ababa",
  deliveryName = "Customer",
  courierName = "Abebe Kebede",
  courierPhone = "+251 91 234 5678",
  courierPlate = "3-A-12849",
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const courierMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const animFrameRef = useRef(null);

  const [progress, setProgress] = useState(() => getInitialProgress(orderStatus));
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!isSimulating) {
      setProgress(getInitialProgress(orderStatus));
    }
  }, [orderStatus, isSimulating]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: [9.0155, 38.7752],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

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

    routeLineRef.current = L.polyline(ROUTE_WAYPOINTS, {
      color: "#16a34a",
      weight: 5,
      opacity: 0.8,
      dashArray: "8, 8",
    }).addTo(map);

    map.fitBounds(L.latLngBounds(ROUTE_WAYPOINTS), { padding: [50, 50] });

    const initialPos = interpolatePosition(progress);
    const courierIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-300">
          <span class="absolute inline-flex h-14 w-14 animate-pulse rounded-full bg-emerald-400 opacity-30"></span>
          <div class="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-emerald-400 shadow-2xl ring-4 ring-emerald-500/80">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="15" cy="5" r="1"/>
              <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
            </svg>
          </div>
          <span class="absolute -bottom-6 whitespace-nowrap rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold text-white shadow">
            Courier En Route
          </span>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    courierMarkerRef.current = L.marker(initialPos, { icon: courierIcon })
      .addTo(map)
      .bindPopup(`<b>${courierName}</b><br>Electric Delivery Courier`);

    mapInstanceRef.current = map;

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!courierMarkerRef.current) return;
    const newCoords = interpolatePosition(progress);
    courierMarkerRef.current.setLatLng(newCoords);
  }, [progress]);

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

  const distanceRemainingKm = ((1 - progress) * 3.4).toFixed(1);
  const minutesRemaining = Math.max(2, Math.round((1 - progress) * 22));

  return (
    <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Live Delivery Radar</h3>
            <p className="text-xs text-gray-500">Real-time GPS telemetry from Bole Hub to {deliveryAddress}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSimulation}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition shadow-sm ${
              isSimulating
                ? "bg-amber-500 text-white animate-pulse"
                : "bg-green-700 text-white hover:bg-green-800"
            }`}
          >
            <Play className="h-3 w-3 fill-current" />
            {isSimulating ? "Pause Drive" : "Simulate Drive"}
          </button>
          <button
            onClick={resetSimulation}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
            title="Reset position"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div ref={mapContainerRef} className="h-72 w-full sm:h-96" style={{ minHeight: "288px" }} />

        <div className="absolute top-3 left-3 z-[400] flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white/95 backdrop-blur-md px-3.5 py-2 shadow-lg border border-gray-100">
            <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            <span className="text-xs font-bold text-gray-900">
              {progress >= 1 ? "Arrived at Destination" : `${minutesRemaining} mins away`}
            </span>
            <span className="h-3 w-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-500">
              {progress >= 1 ? "Delivered" : `${distanceRemainingKm} km remaining`}
            </span>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-[400] sm:right-auto sm:max-w-md">
          <div className="rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
              <span>Transit Progress</span>
              <span className="text-green-700">{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/60 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt={courierName}
                className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white shadow"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80";
                }}
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                <Bike className="h-2.5 w-2.5 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-gray-900">{courierName}</h4>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <ShieldCheck className="h-3 w-3" /> Verified Courier
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Delivo Express Rider • Plate <span className="font-semibold text-gray-700">{courierPlate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${courierPhone.replace(/\s+/g, "")}`}
              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-2xl bg-green-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-800 transition active:scale-95"
            >
              <Phone className="h-3.5 w-3.5" /> Call Courier
            </a>
            <div className="flex items-center gap-1 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-gray-700 border border-gray-200">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span>Est. {minutesRemaining} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
