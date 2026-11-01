import React, { useEffect, useState, useMemo } from "react";
import {
  X,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Clock,
  Tag,
  Flame,
  Check,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import FoodImage from "./FoodImage";

const SPICE_LEVELS = [
  { id: "mild", label: "Mild", icon: "🌿", desc: "Gentle seasoning" },
  { id: "medium", label: "Medium", icon: "🌶️", desc: "Authentic kick" },
  { id: "hot", label: "Hot 🔥", icon: "🔥", desc: "Traditional Mitmita" },
];

const FOOD_ADDONS = [
  { id: "ayib", name: "Extra Ayib (Cottage Cheese)", price: 25 },
  { id: "injera", name: "Extra Fresh Injera Roll", price: 15 },
  { id: "awaze", name: "Signature Awaze Dip", price: 15 },
  { id: "drink", name: "Chilled Mineral Water", price: 20 },
];

const DRINK_ADDONS = [
  { id: "lemon", name: "Fresh Lemon Wedge", price: 10 },
  { id: "ice_extra", name: "Extra Crushed Ice", price: 0 },
  { id: "mint", name: "Fresh Mint Leaves", price: 15 },
];

const FoodItemModal = ({ item, onClose }) => {
  const { addItem, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState("medium");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialNote, setSpecialNote] = useState("");

  const isDrink = item?.category?.toLowerCase().includes("drink");
  const availableAddons = isDrink ? DRINK_ADDONS : FOOD_ADDONS;

  const inCart = useMemo(() => {
    return cartItems
      .filter((c) => c.id === item?.id)
      .reduce((sum, c) => sum + c.quantity, 0);
  }, [cartItems, item?.id]);



  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const basePrice = parseFloat(item.price) || 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const sortedAddonIds = selectedAddons.map((a) => a.id).sort().join("-");
    const cartItemId = `${item.id}-${isDrink ? "drink" : spiceLevel}-${sortedAddonIds || "std"}${specialNote ? "-custom" : ""}`;

    addItem({
      id: item.id,
      cartItemId,
      name: item.name,
      subtitle: item.category,
      description: item.description,
      image: item.image,
      basePrice,
      price: unitPrice,
      quantity,
      selectedSpice: isDrink ? null : spiceLevel,
      selectedAddons: selectedAddons.map((a) => a.name),
      specialNote: specialNote.trim() || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Center Wrapper */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        {/* Card */}
        <div
          className="relative w-full max-w-lg max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left animate-scale-in my-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="food-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Image */}
          <div className="relative h-44 sm:h-52 w-full flex-shrink-0 bg-gray-100 overflow-hidden">
            <FoodImage
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Close button */}
            <button
              id="food-modal-close"
              onClick={onClose}
              className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-white hover:text-gray-900 transition-all focus:outline-none"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Category badge & Rating on image */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
              <span className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-gray-900 shadow">
                <Tag className="h-3 w-3 text-green-600" />
                {item.category || "Main Dish"}
              </span>

              <div className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-yellow-400 border border-white/10">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{item.rating || "4.8"}</span>
                <span className="text-gray-300 font-normal">/ 5.0</span>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Title & Cart indicator */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <h2 id="food-modal-title" className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                  {item.name}
                </h2>
                {inCart > 0 && (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
                    <ShoppingCart className="h-3 w-3" />
                    {inCart} in cart
                  </span>
                )}
              </div>

              {/* Delivery and preparation info */}
              <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1 font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                  <Clock className="h-3.5 w-3.5 text-green-600" />
                  20–35 min
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                  Freshly Prepared
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-gray-50/80 p-3.5 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {item.description || "Crafted with authentic ingredients, seasoned to perfection and prepared fresh on order."}
              </p>
            </div>

            {/* Spice Level Option (For non-drinks) */}
            {!isDrink && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    Spice Intensity
                  </span>
                  <span className="text-xs text-green-700 font-semibold">Choose 1</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {SPICE_LEVELS.map((s) => {
                    const isSelected = spiceLevel === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSpiceLevel(s.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? "border-green-600 bg-green-50/80 shadow-sm ring-2 ring-green-600/20"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xl mb-1">{s.icon}</span>
                        <span className={`text-xs font-bold ${isSelected ? "text-green-900" : "text-gray-800"}`}>
                          {s.label}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{s.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-ons & Extras */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Customize & Add-ons
                </span>
                <span className="text-xs text-gray-400">Optional</span>
              </div>

              <div className="space-y-2">
                {availableAddons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer select-none transition-all ${
                        isChecked
                          ? "border-green-500 bg-green-50/50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                            isChecked
                              ? "bg-green-600 border-green-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-800">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-green-700">
                        {addon.price > 0 ? `+ETB ${addon.price.toFixed(2)}` : "Free"}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions Note */}
            <div>
              <label
                htmlFor="special-note"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                Special Instructions
              </label>
              <input
                id="special-note"
                type="text"
                placeholder="e.g. No onions, sauce packed separately..."
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                maxLength={100}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>

            {/* Price & Quantity Selector */}
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Item Unit Price</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl font-extrabold text-green-700">
                    ETB {unitPrice.toFixed(2)}
                  </p>
                  {addonsTotal > 0 && (
                    <span className="text-xs text-gray-400 font-medium">
                      (Base {basePrice.toFixed(0)} + Extras {addonsTotal.toFixed(0)})
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                <button
                  id="food-modal-decrease"
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-gray-900 select-none">
                  {quantity}
                </span>
                <button
                  id="food-modal-increase"
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 sm:px-6 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
            <button
              id="food-modal-add-to-cart"
              type="button"
              onClick={handleAdd}
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-600/25 hover:bg-green-700 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="h-5 w-5" />
                <span>Add {quantity} to Order</span>
              </div>
              <span className="rounded-xl bg-green-700/60 px-3 py-1 text-sm font-extrabold tracking-wide">
                ETB {totalPrice.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItemModal;
