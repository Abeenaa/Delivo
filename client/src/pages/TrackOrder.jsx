import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ChefHat,
  Clock,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { orderAPI } from "../services/api";

const statusSteps = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "out_for_delivery", label: "On the Way", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
];

const statusIndex = (status) => statusSteps.findIndex((step) => step.key === status);

const formatStatus = (status) => {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[status] || "Pending";
};

const estimateDeliveryWindow = (createdAt, status) => {
  if (!createdAt || status === "cancelled") {
    return "Not available";
  }

  if (status === "delivered") {
    return "Delivered";
  }

  const created = new Date(createdAt);
  const from = new Date(created.getTime() + 25 * 60 * 1000);
  const to = new Date(created.getTime() + 40 * 60 * 1000);

  return `${from.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${to.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await orderAPI.trackOrder(id);
        if (response.success) {
          setOrder(response.data);
        }
      } catch (err) {
        setError(err.message || "Unable to load this order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const currentStatusIndex = useMemo(() => {
    if (!order || order.status === "cancelled") {
      return -1;
    }

    return statusIndex(order.status);
  }, [order]);

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/order-history"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>

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
            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                    Order Tracking
                  </p>
                  <h1 className="mt-1 text-3xl font-bold text-gray-900">
                    Order #{order.id}
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    Placed on{" "}
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 px-5 py-4 text-left sm:text-right">
                  <p className="text-xs font-semibold uppercase text-green-700">Current Status</p>
                  <p className="mt-1 text-xl font-bold text-green-900">{formatStatus(order.status)}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    ETA: {estimateDeliveryWindow(order.created_at, order.status)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              {order.status === "cancelled" ? (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <p className="font-semibold">This order has been cancelled.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-5">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isDone = index <= currentStatusIndex;
                    return (
                      <div
                        key={step.key}
                        className={`rounded-2xl border p-4 ${
                          isDone
                            ? "border-green-200 bg-green-50 text-green-900"
                            : "border-gray-100 bg-gray-50 text-gray-400"
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${isDone ? "text-green-600" : "text-gray-400"}`} />
                        <p className="mt-3 text-sm font-bold">{step.label}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              <section className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                  Items
                </h2>
                <div className="mt-5 space-y-4">
                  {(order.items || []).map((item) => (
                    <div key={item.food_item_id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <img
                        src={item.image_url || "/assets/food.png"}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover bg-gray-100"
                        onError={(event) => {
                          event.currentTarget.src = "/assets/food.png";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-green-700">
                        ETB {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="space-y-6">
                <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-bold text-gray-900">Delivery</h2>
                  <div className="mt-4 space-y-3 text-sm">
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
                  <h2 className="text-xl font-bold text-gray-900">Summary</h2>
                  <div className="mt-4 space-y-3 text-sm">
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
