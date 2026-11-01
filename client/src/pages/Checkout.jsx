import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, Minus, Plus, ShoppingCart, Trash2,
  MapPin, Phone, User, MessageSquare, CreditCard, Wallet, Check,
  Tag, X, Loader, Shield, Clock, Zap, Star, Package
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FoodImage from "../components/FoodImage";
import { useCart } from "../context/CartContext";
import { orderAPI, paymentAPI } from "../services/api";
import { useToast } from "../context/ToastContext";

const COUPONS = {
  DELIVO30: { type: "percent", value: 30, label: "30% off" },
  FREESHIP: { type: "shipping", value: 0, label: "Free shipping" },
  WELCOME10: { type: "percent", value: 10, label: "10% off" },
};

const PAYMENT_LABELS = {
  chapa: "Chapa (Online Payment)",
  cash: "Cash on Delivery",
  mobile: "Direct Bank Transfer",
  card: "Card Payment",
};

const StepIndicator = ({ currentStep }) => {
  const steps = [{ num:1, label:"Cart Review" },{ num:2, label:"Delivery & Payment" },{ num:3, label:"Confirmed" }];
  return (
    <div className="mt-6 flex items-center justify-center gap-1 sm:gap-2">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ${currentStep > step.num ? "bg-green-600 text-white" : currentStep === step.num ? "bg-green-600 text-white shadow-lg shadow-green-600/30 ring-4 ring-green-100" : "bg-gray-100 text-gray-400"}`}>
              {currentStep > step.num ? <Check className="h-4 w-4" /> : step.num}
            </div>
            <span className={`text-xs sm:text-sm font-medium transition-colors hidden sm:block ${currentStep >= step.num ? "text-green-600" : "text-gray-400"}`}>{step.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`h-0.5 w-6 sm:w-12 mx-1 sm:mx-2 rounded transition-all duration-500 ${currentStep > step.num ? "bg-green-500" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
};

const OrderConfirmed = ({ placedOrder, deliveryInfo, paymentMethod, cartSnapshot, total }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!placedOrder?.id) return;
    const target = placedOrder.id;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      setCount(prev => { if (prev + step >= target) { clearInterval(timer); return target; } return prev + step; });
    }, 30);
    return () => clearInterval(timer);
  }, [placedOrder?.id]);
  const estimatedTime = paymentMethod === "chapa" ? "25-35 min" : "30-45 min";
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 animate-page-in">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="h-28 w-28 rounded-full bg-green-100" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-green-600 flex items-center justify-center shadow-xl shadow-green-600/40">
                <Check className="h-10 w-10 text-white" strokeWidth={3} />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 animate-bounce" />
            <span className="absolute -bottom-1 -left-2 h-4 w-4 rounded-full bg-emerald-400 animate-bounce" style={{animationDelay:"0.2s"}} />
            <span className="absolute top-2 -left-3 h-3 w-3 rounded-full bg-green-300 animate-bounce" style={{animationDelay:"0.4s"}} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-500 text-base">Thank you, <strong className="text-gray-800">{deliveryInfo.fullName}</strong>! Your food is being prepared.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <Package className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-medium mb-1">Order Number</p>
            <p className="text-2xl font-extrabold text-gray-900">#{placedOrder?.id ? count : "-"}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <Clock className="h-5 w-5 text-orange-500 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-medium mb-1">Est. Delivery</p>
            <p className="text-2xl font-extrabold text-orange-600">{estimatedTime}</p>
          </div>
        </div>
        {cartSnapshot && cartSnapshot.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50"><h2 className="font-bold text-gray-900 flex items-center gap-2"><ShoppingCart className="h-4 w-4 text-green-600" /> Your Items</h2></div>
            <div className="divide-y divide-gray-50">
              {cartSnapshot.map(item => (
                <div key={item.cartItemId || item.id} className="flex items-center gap-3 px-5 py-3">
                  <FoodImage src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    {item.selectedSpice && (
                      <span className="text-[10px] text-orange-600 font-semibold mr-1">
                        [{item.selectedSpice}]
                      </span>
                    )}
                    <span className="text-xs text-gray-400">x{item.quantity}</span>
                  </div>
                  <p className="font-bold text-green-700 text-sm">ETB {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50"><h2 className="font-bold text-gray-900">Order Summary</h2></div>
          <div className="px-5 py-4 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600"><span>Payment Method</span><span className="font-semibold text-gray-900">{PAYMENT_LABELS[paymentMethod] || paymentMethod}</span></div>
            <div className="flex justify-between text-gray-600"><span>Delivery to</span><span className="font-semibold text-gray-900 text-right max-w-[55%] leading-tight">{deliveryInfo.address}, {deliveryInfo.city}</span></div>
            <div className="flex justify-between border-t border-gray-100 pt-3"><span className="font-extrabold text-gray-900 text-base">Total Paid</span><span className="font-extrabold text-green-600 text-base">ETB {(placedOrder?.total_amount ? parseFloat(placedOrder.total_amount) : total).toFixed(2)}</span></div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {placedOrder?.id && (<Link id="track-order-btn" to={`/track-order/${placedOrder.id}`} className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 font-bold text-white shadow-lg hover:bg-green-700 active:scale-[0.99] transition"><Clock className="h-5 w-5" />Track My Order<ArrowRight className="h-5 w-5 ml-auto" /></Link>)}
          <Link to="/order" className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-gray-200 px-6 py-4 font-semibold text-gray-700 hover:bg-gray-50 transition"><ShoppingCart className="h-4 w-4" />Continue Shopping</Link>
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3">
          <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">Your order will be delivered to <strong>{deliveryInfo.address}, {deliveryInfo.city}</strong>. Our rider will call <strong>{deliveryInfo.phone}</strong>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Checkout = () => {
  const { showSuccess, showError } = useToast();
  const { cartItems, itemCount, subtotal, incrementItem, decrementItem, removeItem, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartSnapshot, setCartSnapshot] = useState([]);
  const [deliveryInfo, setDeliveryInfo] = useState({ fullName:"", phone:"", address:"", city:"Addis Ababa", notes:"" });
  const [paymentMethod, setPaymentMethod] = useState("chapa");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponShake, setCouponShake] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const baseDeliveryFee = cartItems.length > 0 ? 45 : 0;
  const deliveryFee = appliedCoupon?.type === "shipping" ? 0 : baseDeliveryFee;
  const discountAmount = appliedCoupon?.type === "percent" ? Math.round(subtotal * appliedCoupon.value / 100) : 0;
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) { setAppliedCoupon({ ...COUPONS[code], code }); setCouponError(""); showSuccess(`Coupon applied: ${COUPONS[code].label}`); }
    else { setCouponError("Invalid coupon code"); setCouponShake(true); setTimeout(() => setCouponShake(false), 500); }
  };
  const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponCode(""); setCouponError(""); };
  const handleInputChange = (field) => (e) => setDeliveryInfo(prev => ({ ...prev, [field]: e.target.value }));
  const handleProceedToDelivery = () => { if (cartItems.length === 0) return; setCurrentStep(2); window.scrollTo({ top:0, behavior:"smooth" }); };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.address) { showError("Please fill in all required delivery information"); return; }
    try {
      const orderData = {
        items: cartItems.map(item => ({ food_item_id: item.id, quantity: item.quantity, price: item.price })),
        delivery_name: deliveryInfo.fullName, delivery_phone: deliveryInfo.phone,
        delivery_address: `${deliveryInfo.address}, ${deliveryInfo.city}`,
        payment_method: paymentMethod, notes: deliveryInfo.notes || null,
      };
      const response = await orderAPI.create(orderData);
      if (response.success) {
        const orderId = response.data.id;
        setPlacedOrder(response.data);
        setCartSnapshot([...cartItems]);
        if (paymentMethod === "chapa") {
          setIsProcessingPayment(true);
          try {
            const payRes = await paymentAPI.initialize(orderId);
            if (payRes.success && payRes.data?.checkout_url) { clearCart(); window.location.href = payRes.data.checkout_url; return; }
            else { showError("Could not start payment. Please try again."); setIsProcessingPayment(false); return; }
          } catch (payErr) { showError(`Payment error: ${payErr.message}`); setIsProcessingPayment(false); return; }
        }
        const order = { id: orderId || `ORD-${Date.now()}`, date: new Date().toISOString(), items: cartItems, deliveryInfo, paymentMethod, subtotal, deliveryFee, total, status: "pending" };
        const existing = JSON.parse(localStorage.getItem("orderHistory") || "[]");
        existing.unshift(order);
        localStorage.setItem("orderHistory", JSON.stringify(existing));
        clearCart();
        showSuccess("Order placed successfully!");
        setCurrentStep(3);
        window.scrollTo({ top:0, behavior:"smooth" });
      }
    } catch (error) { console.error("Order submission failed:", error); showError(`Failed to place order: ${error.message}`); }
  };

  if (currentStep === 3) return <OrderConfirmed placedOrder={placedOrder} deliveryInfo={deliveryInfo} paymentMethod={paymentMethod} cartSnapshot={cartSnapshot} total={total} />;

  return (
    <div className="min-h-screen bg-[#f0fdf4] animate-page-in">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Checkout</h1>
          <p className="mt-1 text-gray-500">{currentStep === 1 ? "Review your cart before proceeding" : "Almost there — fill in your delivery details"}</p>
          <StepIndicator currentStep={currentStep} />
        </div>
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-4"><ShoppingCart className="h-10 w-10 text-gray-400" /></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious items to get started</p>
            <Link to="/order" className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition shadow-lg">Browse Menu <ArrowRight className="h-5 w-5" /></Link>
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                      <h2 className="text-lg font-bold text-gray-900">Order Items <span className="text-gray-400 font-normal">({itemCount})</span></h2>
                      <button type="button" onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium transition flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Clear All</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {cartItems.map(item => {
                        const itemKey = item.cartItemId || item.id;
                        return (
                          <div key={itemKey} className="flex gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                            <FoodImage src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-0.5">{item.name}</h3>
                              
                              {/* Customization Badges */}
                              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                {item.selectedSpice && (
                                  <span className="inline-flex items-center gap-0.5 rounded-md bg-orange-50 px-1.5 py-0.5 text-[11px] font-bold text-orange-700">
                                    {item.selectedSpice === "hot" ? "🔥 Hot" : item.selectedSpice === "medium" ? "🌶️ Medium" : "🌿 Mild"}
                                  </span>
                                )}
                                {item.selectedAddons?.map((addon, idx) => (
                                  <span key={idx} className="rounded-md bg-green-50 px-1.5 py-0.5 text-[11px] font-medium text-green-700">
                                    +{addon}
                                  </span>
                                ))}
                              </div>

                              {item.specialNote && (
                                <p className="text-xs text-gray-400 italic mb-2 truncate">
                                  Note: "{item.specialNote}"
                                </p>
                              )}

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-1 py-0.5">
                                  <button type="button" onClick={() => decrementItem(itemKey)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white transition" aria-label="Decrease"><Minus className="h-3.5 w-3.5 text-gray-600" /></button>
                                  <span className="w-7 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                                  <button type="button" onClick={() => incrementItem(itemKey)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white transition" aria-label="Increase"><Plus className="h-3.5 w-3.5 text-gray-600" /></button>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-green-700">ETB {(item.price * item.quantity).toFixed(2)}</span>
                                  <button type="button" onClick={() => removeItem(itemKey)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
                    {!appliedCoupon ? (
                      <div className={`mb-5 ${couponShake ? "animate-shake" : ""}`}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Promo Code</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input id="coupon-input" type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }} onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()} placeholder="e.g. DELIVO30" className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
                          </div>
                          <button id="apply-coupon" type="button" onClick={handleApplyCoupon} className="px-4 py-2.5 rounded-xl bg-green-100 text-green-800 text-sm font-bold hover:bg-green-200 transition">Apply</button>
                        </div>
                        {couponError && <p className="mt-1.5 text-xs text-red-500">{couponError}</p>}
                      </div>
                    ) : (
                      <div className="mb-5 flex items-center justify-between rounded-xl bg-green-50 border border-green-200 px-3 py-2.5">
                        <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-green-600" /><span className="text-sm font-bold text-green-800">{appliedCoupon.code}</span><span className="text-xs text-green-600">({appliedCoupon.label})</span></div>
                        <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 transition"><X className="h-4 w-4" /></button>
                      </div>
                    )}
                    <div className="space-y-3 text-sm mb-6">
                      <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold text-gray-900">ETB {subtotal.toFixed(2)}</span></div>
                      {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({appliedCoupon.value}%)</span><span className="font-semibold">-ETB {discountAmount.toFixed(2)}</span></div>}
                      <div className="flex justify-between"><span className="text-gray-500">Delivery Fee</span><span className={`font-semibold ${appliedCoupon?.type === "shipping" ? "text-green-600" : "text-gray-900"}`}>{appliedCoupon?.type === "shipping" ? "FREE" : `ETB ${deliveryFee.toFixed(2)}`}</span></div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between"><span className="font-bold text-gray-900">Total</span><span className="font-extrabold text-green-600 text-lg">ETB {total.toFixed(2)}</span></div>
                    </div>
                    <button id="proceed-to-delivery" onClick={handleProceedToDelivery} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20 active:scale-[0.99] mb-3">Proceed to Delivery <ArrowRight className="h-5 w-5" /></button>
                    <Link to="/order" className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">Continue Shopping</Link>
                    <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400"><Shield className="h-3.5 w-3.5" /><span>Secure checkout · SSL encrypted</span></div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <form onSubmit={handlePlaceOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100"><MapPin className="h-4 w-4 text-green-600" /></div>
                        Delivery Information
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                          <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" required value={deliveryInfo.fullName} onChange={handleInputChange("fullName")} placeholder="Abebe Kebede" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm" /></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                          <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="tel" required value={deliveryInfo.phone} onChange={handleInputChange("phone")} placeholder="+251 912 345 678" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm" /></div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address *</label>
                          <div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><input type="text" required value={deliveryInfo.address} onChange={handleInputChange("address")} placeholder="Street address, building, apartment..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm" /></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                          <input type="text" value={deliveryInfo.city} onChange={handleInputChange("city")} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Notes <span className="text-gray-400">(Optional)</span></label>
                          <div className="relative"><MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><input type="text" value={deliveryInfo.notes} onChange={handleInputChange("notes")} placeholder="e.g. Ring the doorbell" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm" /></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100"><CreditCard className="h-4 w-4 text-green-600" /></div>
                        Payment Method
                      </h2>
                      <div className="space-y-3">
                        <button type="button" onClick={() => setPaymentMethod("chapa")} className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 transition text-left ${paymentMethod === "chapa" ? "border-green-500 bg-green-50/60 shadow-sm ring-2 ring-green-500/20" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg transition ${paymentMethod === "chapa" ? "bg-green-600 text-white shadow-md shadow-green-600/30" : "bg-gray-100 text-gray-600"}`}>⚡</div>
                            <div>
                              <div className="flex items-center gap-2"><p className="font-bold text-gray-900">Pay with Chapa</p><span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-600 text-white">Recommended</span></div>
                              <p className="text-xs text-gray-500 mt-0.5">Telebirr · CBE Birr · Awash · Bank Cards</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mt-3 sm:mt-0 pl-14 sm:pl-0 flex-wrap">
                            <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">Telebirr</span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-100">CBE</span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">Awash</span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg border border-gray-200">Cards</span>
                          </div>
                        </button>
                        <button type="button" onClick={() => setPaymentMethod("cash")} className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${paymentMethod === "cash" ? "border-green-500 bg-green-50/60 shadow-sm ring-2 ring-green-500/20" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${paymentMethod === "cash" ? "bg-green-600 shadow-md shadow-green-600/30" : "bg-gray-100"}`}><Wallet className={`h-5 w-5 ${paymentMethod === "cash" ? "text-white" : "text-gray-600"}`} /></div>
                          <div><p className="font-bold text-gray-900">Cash on Delivery</p><p className="text-xs text-gray-500">Pay when you receive your order</p></div>
                        </button>
                        <button type="button" onClick={() => setPaymentMethod("mobile")} className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${paymentMethod === "mobile" ? "border-green-500 bg-green-50/60 shadow-sm ring-2 ring-green-500/20" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${paymentMethod === "mobile" ? "bg-green-600 shadow-md shadow-green-600/30" : "bg-gray-100"}`}><Phone className={`h-5 w-5 ${paymentMethod === "mobile" ? "text-white" : "text-gray-600"}`} /></div>
                          <div><p className="font-bold text-gray-900">Direct Transfer</p><p className="text-xs text-gray-500">Manual bank transfer / slip</p></div>
                        </button>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400"><Shield className="h-3.5 w-3.5 text-green-500" /> SSL Encrypted</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400"><Star className="h-3.5 w-3.5 text-yellow-400" /> Secure & Trusted</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400"><Zap className="h-3.5 w-3.5 text-blue-400" /> Powered by Chapa</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-6 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-50"><h2 className="font-bold text-gray-900">Order Summary</h2></div>
                      <div className="divide-y divide-gray-50 max-h-52 overflow-y-auto">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                            <FoodImage src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p><p className="text-xs text-gray-400">x{item.quantity}</p></div>
                            <p className="text-sm font-bold text-green-700 flex-shrink-0">ETB {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      {appliedCoupon && (
                        <div className="mx-5 mt-3 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-3 py-2">
                          <Tag className="h-4 w-4 text-green-600" /><span className="text-sm font-bold text-green-800">{appliedCoupon.code}</span><span className="text-xs text-green-600">({appliedCoupon.label})</span>
                        </div>
                      )}
                      <div className="px-5 py-4 space-y-2.5 text-sm border-t border-gray-50">
                        <div className="flex justify-between text-gray-500"><span>Items ({itemCount})</span><span className="font-semibold text-gray-900">ETB {subtotal.toFixed(2)}</span></div>
                        {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-semibold">-ETB {discountAmount.toFixed(2)}</span></div>}
                        <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span className={`font-semibold ${appliedCoupon?.type === "shipping" ? "text-green-600" : "text-gray-900"}`}>{appliedCoupon?.type === "shipping" ? "FREE" : `ETB ${deliveryFee.toFixed(2)}`}</span></div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between"><span className="font-extrabold text-gray-900">Total</span><span className="font-extrabold text-green-600 text-lg">ETB {total.toFixed(2)}</span></div>
                      </div>
                      <div className="px-5 pb-5 space-y-3">
                        <button id="place-order-btn" type="submit" disabled={isProcessingPayment} className={`w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-bold transition shadow-lg active:scale-[0.99] ${isProcessingPayment ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-green-600/25"}`}>
                          {isProcessingPayment ? (<><Loader className="h-5 w-5 animate-spin" /><span>Connecting to Chapa...</span></>) : paymentMethod === "chapa" ? (<><span>Pay ETB {total.toFixed(2)} with Chapa</span><ArrowRight className="h-5 w-5" /></>) : (<><span>Place Order · ETB {total.toFixed(2)}</span><ArrowRight className="h-5 w-5" /></>)}
                        </button>
                        <button type="button" onClick={() => { setCurrentStep(1); window.scrollTo({ top:0, behavior:"smooth" }); }} className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">
                          <ArrowLeft className="h-4 w-4" /> Back to Cart
                        </button>
                        <p className="text-xs text-gray-400 text-center">By placing your order, you agree to our Terms & Conditions</p>
                      </div>
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
