import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, ChefHat, Calendar, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../services/api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Fetch only THIS user's orders from the backend using their token
        const response = await orderAPI.getUserOrders();
        if (response.success) {
          // Map backend format to display format
          const mapped = response.data.map(order => ({
            id: order.id,
            date: order.created_at,
            status: order.status,
            paymentMethod: order.payment_method,
            total: parseFloat(order.total_amount),
            deliveryFee: parseFloat(order.delivery_fee),
            subtotal: parseFloat(order.total_amount) - parseFloat(order.delivery_fee),
            items: (order.items || []).map(item => ({
              name: item.name || 'Unknown item',
              quantity: item.quantity,
              price: parseFloat(item.price),
              image: item.image_url || "/assets/food.png",
            })),
          }));
          setOrders(mapped);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return { bg: "bg-green-100 text-green-700", icon: <CheckCircle className="h-4 w-4" /> };
      case "preparing":
        return { bg: "bg-blue-100 text-blue-700", icon: <ChefHat className="h-4 w-4" /> };
      case "pending":
        return { bg: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-4 w-4" /> };
      case "on-the-way":
      case "out_for_delivery":
        return { bg: "bg-orange-100 text-orange-700", icon: <Package className="h-4 w-4" /> };
      case "cancelled":
        return { bg: "bg-red-100 text-red-700", icon: <XCircle className="h-4 w-4" /> };
      default:
        return { bg: "bg-gray-100 text-gray-700", icon: <Clock className="h-4 w-4" /> };
    }
  };

  const formatStatus = (status) => {
    const map = {
      "on-the-way": "On the Way",
      "out_for_delivery": "Out for Delivery",
    };
    return map[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">My Orders</h1>
          <p className="mt-2 text-gray-500">Track and review your recent orders</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
            <p className="text-gray-500 text-sm">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 mb-4">
              <ShoppingBag className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders. Start exploring our menu!</p>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const { bg, icon } = getStatusStyle(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
                        <Package className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Order #{order.id?.toString().slice(-6) || order.id}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg}`}>
                      {icon}
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="px-4 sm:px-6 py-4">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                            onError={(e) => { e.target.src = "/assets/food.png"; }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                            ETB {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer: totals and tracking */}
                  <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 min-w-0">
                      <span className="flex-shrink-0">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      <span>·</span>
                      <span className="truncate">{order.paymentMethod === "cash" ? "Cash on Delivery" : "Mobile Money"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <Link
                        to={`/track-order/${order.id}`}
                        className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                      >
                        Track Order
                      </Link>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="text-base font-bold text-green-600">ETB {order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistory;
