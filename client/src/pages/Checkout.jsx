import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Minus, Plus, ShoppingCart, Trash2, MapPin, Phone, User, MessageSquare, CreditCard, Wallet, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../services/api";
import { useToast } from "../context/ToastContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const {
    cartItems,
    itemCount,
    subtotal,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  const [currentStep, setCurrentStep] = useState(1); // 1: Cart Review, 2: Delivery & Payment, 3: Success
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "Addis Ababa",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [placedOrder, setPlacedOrder] = useState(null);

  const deliveryFee = cartItems.length > 0 ? 45 : 0;
  const total = subtotal + deliveryFee;
  const confirmationTotal = placedOrder?.total_amount ? parseFloat(placedOrder.total_amount) : total;

  const handleInputChange = (field) => (e) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleProceedToDelivery = () => {
    if (cartItems.length === 0) return;
    setCurrentStep(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.address) {
      showError("Please fill in all required delivery information");
      return;
    }

    try {
      // Prepare order data for API
      const orderData = {
        items: cartItems.map(item => ({
          food_item_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        delivery_name: deliveryInfo.fullName,
        delivery_phone: deliveryInfo.phone,
        delivery_address: `${deliveryInfo.address}, ${deliveryInfo.city}`,
        payment_method: paymentMethod,
        notes: deliveryInfo.notes || null
      };

      console.log('Submitting order:', orderData);
      console.log('Cart items:', cartItems);
      console.log('Delivery info:', deliveryInfo);
      console.log('Payment method:', paymentMethod);

      // Submit order to backend API
      const response = await orderAPI.create(orderData);
      console.log('Order response:', response);
      
      if (response.success) {
        setPlacedOrder(response.data);
        // Also save to localStorage for order history
        const order = {
          id: response.data.id || `ORD-${Date.now()}`,
          date: new Date().toISOString(),
          items: cartItems,
          deliveryInfo,
          paymentMethod,
          subtotal,
          deliveryFee,
          total,
          status: "pending",
        };

        const existingOrders = JSON.parse(localStorage.getItem("orderHistory") || "[]");
        existingOrders.unshift(order);
        localStorage.setItem("orderHistory", JSON.stringify(existingOrders));

        setCurrentStep(3);
        clearCart();
        showSuccess("Order placed successfully!");
        
        // Keep the confirmation visible so customers can track the order.
      }
    } catch (error) {
      console.error('Order submission failed:', error);
      showError(`Failed to place order: ${error.message}`);
    }
  };

  // Step 3: Success Page
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-[#f0fdf4]">
        <Navbar />
        <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-2">Thank you for your order, {deliveryInfo.fullName}</p>
            <p className="text-gray-600 mb-8">Your food will be delivered to {deliveryInfo.address}</p>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
              {placedOrder?.id && (
                <>
                  <p className="text-sm text-gray-600 mb-2">Order Number</p>
                  <p className="mb-5 text-2xl font-bold text-gray-900">#{placedOrder.id}</p>
                </>
              )}
              <p className="text-sm text-gray-600 mb-2">Order Total</p>
              <p className="text-3xl font-bold text-green-600">ETB {confirmationTotal.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-2">Payment Method: {paymentMethod === "cash" ? "Cash on Delivery" : "Mobile Money"}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {placedOrder?.id && (
                <Link
                  to={`/track-order/${placedOrder.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Track Order
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
              <Link
                to="/order"
                className="inline-flex items-center justify-center rounded-full bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Steps */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Checkout</h1>
          <p className="mt-2 text-gray-600">
            {currentStep === 1 ? "Review your cart" : "Complete your delivery information"}
          </p>
          
          {/* Step Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full font-semibold text-sm ${
                currentStep >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className={`text-xs sm:text-sm font-medium ${currentStep >= 1 ? "text-green-600" : "text-gray-600"}`}>
                Cart Review
              </span>
            </div>
            
            <div className={`h-0.5 w-8 sm:w-16 ${currentStep >= 2 ? "bg-green-600" : "bg-gray-300"}`}></div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full font-semibold text-sm ${
                currentStep >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                2
              </div>
              <span className={`text-xs sm:text-sm font-medium ${currentStep >= 2 ? "text-green-600" : "text-gray-600"}`}>
                <span className="hidden sm:inline">Delivery & </span>Payment
              </span>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started</p>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
            >
              Browse Menu
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Step 1: Cart Review */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Order Items ({itemCount})</h2>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.subtitle}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => decrementItem(item.id)}
                                  className="p-1 hover:bg-gray-200 rounded transition"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => incrementItem(item.id)}
                                  className="p-1 hover:bg-gray-200 rounded transition"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-green-600">ETB {(item.price * item.quantity).toFixed(2)}</span>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                    <div className="space-y-3 text-sm mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">ETB {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold">ETB {deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-green-600 text-lg">ETB {total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToDelivery}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg"
                    >
                      Proceed to Delivery
                      <ArrowRight className="h-5 w-5" />
                    </button>

                    <Link
                      to="/order"
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery & Payment */}
            {currentStep === 2 && (
              <form onSubmit={handlePlaceOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Forms */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Delivery Information */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        Delivery Information
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={deliveryInfo.fullName}
                              onChange={handleInputChange("fullName")}
                              placeholder="John Doe"
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="tel"
                              required
                              value={deliveryInfo.phone}
                              onChange={handleInputChange("phone")}
                              placeholder="+251 912 345 678"
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Address *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={deliveryInfo.address}
                              onChange={handleInputChange("address")}
                              placeholder="Street address, building, apartment"
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={deliveryInfo.city}
                            onChange={handleInputChange("city")}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Notes (Optional)
                          </label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={deliveryInfo.notes}
                              onChange={handleInputChange("notes")}
                              placeholder="e.g., Ring the bell"
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        Payment Method
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cash")}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                            paymentMethod === "cash"
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            paymentMethod === "cash" ? "bg-green-600" : "bg-gray-100"
                          }`}>
                            <Wallet className={`h-5 w-5 ${paymentMethod === "cash" ? "text-white" : "text-gray-600"}`} />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">Cash on Delivery</p>
                            <p className="text-xs text-gray-600">Pay when you receive</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("mobile")}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                            paymentMethod === "mobile"
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            paymentMethod === "mobile" ? "bg-green-600" : "bg-gray-100"
                          }`}>
                            <Phone className={`h-5 w-5 ${paymentMethod === "mobile" ? "text-white" : "text-gray-600"}`} />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">Mobile Money</p>
                            <p className="text-xs text-gray-600">Pay via M-Pesa</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                      <div className="space-y-3 text-sm mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items ({itemCount})</span>
                          <span className="font-semibold">ETB {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span className="font-semibold">ETB {deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="font-bold text-green-600 text-lg">ETB {total.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg mb-3"
                      >
                        Place Order
                        <ArrowRight className="h-5 w-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                      >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Cart
                      </button>

                      <p className="text-xs text-gray-500 text-center mt-4">
                        By placing your order, you agree to our terms and conditions
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
