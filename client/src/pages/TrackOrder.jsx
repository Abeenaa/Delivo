import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ChefHat,
  Clock,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DeliveryMap from "../components/DeliveryMap";
import { orderAPI } from "../services/api";

const statusSteps = [
  { key: "pending",          label: "Pending",    icon: Clock,        color: "text-gray-500" },
  { key: "confirmed",        label: "Confirmed",  icon: CheckCircle,  color: "text-blue-500" },
  { key: "preparing",        label: "Preparing",  icon: ChefHat,      color: "text-orange-500" },
  { key: "out_for_delivery", label: "On the Way", icon: Truck,        color: "text-purple-500" },
  { key: "delivered",        label: "Delivered",  icon: Package,      color: "text-green-600" },
];

const statusIndex = (status) => statusSteps.findIndex((s) => s.key === status);

const formatStatus = (status) => {
  const labels = {
    pending:          "Pending",
    confirmed:        "Confirmed",
    preparing:        "Preparing",
    out_for_delivery: "Out for Delivery",
    delivered:        "Delivered",
    cancelled:        "Cancelled",
  };
  return labels[status] || "Pending";
};

const estimateDeliveryWindow = (createdAt, status) => {
  if (!createdAt || status === "cancelled") return "Not available";
  if (status === "delivered") return "Delivered ✓";
  const created = new Date(createdAt);
  const from = new Date(created.getTime() + 25 * 60 * 1000);
  const to   = new Date(created.getTime() + 40 * 60 * 1000);
  return `${from.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${to.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

// Animated live status badge that pulses when not delivered
const LiveBadge = ({ status }) => {
  if (status === "delivered" || status === "cancelled") return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
      </span>
      Live Tracking
    </span>
  );
};

const POLL_INTERVAL = 15_000; // 15 seconds

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);
  const pollRef = useRef(null);

  const loadOrder = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const response = await orderAPI.trackOrder(id);
      if (response.success) {
        setOrder(response.data);
        setLastRefresh(new Date());
      }
    } catch (err) {
      setError(err.message || "Unable to load this order");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder(true);
    // Start polling unless already delivered/cancelled
    pollRef.current = setInterval(() => {
      setOrder((prev) => {
        if (prev?.status === "delivered" || prev?.status === "cancelled") {
          clearInterval(pollRef.current);
          return prev;
        }
        return prev;
      });
      loadOrder(false);
    }, POLL_INTERVAL);

    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const currentStatusIndex = useMemo(() => {
    if (!order || order.status === "cancelled") return -1;
    return statusIndex(order.status);
  }, [order]);

  // Progress percentage for the timeline bar
  const progressPct = useMemo(() => {
    if (currentStatusIndex < 0) return 0;
    return Math.round((currentStatusIndex / (statusSteps.length - 1)) * 100);
  }, [currentStatusIndex]);

  return (
    <div className="min-h-screen bg-[#f0fdf4] animate-page-in">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <Link
            to="/order-history"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>
          {lastRefresh && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <RotateCcw className="h-3 w-3" />
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
            <p className="mt-4 text-sm text-gray-500">Loading order tracking...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Order not found</h1>
            <p className="mt-2 text-gray-500">{error}</p>
            <Link
              to="/order-history"
              className="mt-6 inline-flex rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              View My Orders
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Header */}
            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                      Order Tracking
                    </p>
                    <LiveBadge status={order.status} />
                  </div>
                  <h1 className="mt-1 text-3xl font-bold text-gray-900">
                    Order #{order.id}
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    Placed on{" "}
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 px-5 py-4 text-left sm:text-right min-w-max">
                  <p className="text-xs font-semibold uppercase text-green-700">Current Status</p>
                  <p className="mt-1 text-xl font-bold text-green-900">{formatStatus(order.status)}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    ETA: {estimateDeliveryWindow(order.created_at, order.status)}
                  </p>
                </div>
              </div>
            </section>

            {/* ─── Animated Progress Timeline ─── */}
            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
              {order.status === "cancelled" ? (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700">
                  <XCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="font-semibold">This order has been cancelled.</p>
                </div>
              ) : (
                <>
                  {/* Progress bar */}
                  <div className="relative mb-8 hidden sm:block">
                    <div className="h-2 w-full rounded-full bg-gray-200" />
                    <div
                      className="absolute top-0 left-0 h-2 rounded-full bg-green-500 progress-line"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Step icons */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isDone = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;

                      return (
                        <div
                          key={step.key}
                          className={`flex sm:flex-col items-center sm:items-center gap-4 sm:gap-2 rounded-2xl border p-4 sm:p-4 flex-1 transition-all duration-500 ${
                            isCurrent
                              ? "border-green-400 bg-green-50 shadow-md scale-105"
                              : isDone
                              ? "border-green-200 bg-green-50/60 text-green-900"
                              : "border-gray-100 bg-gray-50 text-gray-400"
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                              isCurrent
                                ? "bg-green-600 text-white shadow-lg shadow-green-200"
                                : isDone
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {isCurrent ? (
                              <span className="relative flex h-4 w-4 items-center justify-center">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                                <Icon className="relative h-4 w-4" />
                              </span>
                            ) : (
                              <Icon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="sm:text-center">
                            <p className={`text-sm font-bold ${isDone ? "text-green-900" : "text-gray-400"}`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-[11px] text-green-600 font-medium mt-0.5">In progress</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>

            {/* ─── Live GPS Delivery Radar Map ─── */}
            {order.status !== "cancelled" && (
              <DeliveryMap
                orderStatus={order.status}
                deliveryAddress={order.delivery_address}
                customerPhone={order.delivery_phone}
              />
            )}

            {/* Items + Delivery Summary */}
            <div className="grid gap-6 lg:grid-cols-3">
              <section className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-5">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                  Items
                </h2>
                <div className="space-y-4">
                  {(order.items || []).map((item) => (
                    <div
                      key={item.food_item_id}
                      className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <img
                        src={item.image_url || "/assets/food.png"}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                        onError={(e) => { e.currentTarget.src = "/assets/food.png"; }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-green-700 flex-shrink-0">
                        ETB {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="space-y-6">
                <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery</h2>
                  <div className="space-y-3 text-sm">
                    <p className="flex gap-2 text-gray-700">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      {order.delivery_address}
                    </p>
                    <a
                      href={`tel:${order.delivery_phone}`}
                      className="flex gap-2 font-semibold text-blue-600 hover:underline"
                    >
                      <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {order.delivery_phone}
                    </a>
                  </div>
                </section>

                <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery fee</span>
                      <span className="font-semibold">ETB {parseFloat(order.delivery_fee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment</span>
                      <span className="font-semibold capitalize">{order.payment_method}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-green-700">
                        ETB {parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
