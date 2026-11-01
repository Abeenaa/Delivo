import React from "react";
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import FoodImage from "./FoodImage";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, itemCount, subtotal, incrementItem, decrementItem, removeItem, clearCart } =
    useCart();


  if (!isOpen) return null;

  const deliveryFee = cartItems.length > 0 ? 45 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-backdrop"
        onClick={onClose}
        aria-label="Close cart"
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
              <ShoppingCart className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <p className="text-xs text-gray-500">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            id="cart-drawer-close"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items — scrollable area; footer is always pinned below */}
        <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                <ShoppingBag className="h-9 w-9 text-green-300" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-1">Add some delicious items to get started</p>
              </div>
              <Link
                to="/order"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                Browse Menu <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const itemKey = item.cartItemId || item.id;
                return (
                  <div
                    key={itemKey}
                    className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-2.5 hover:border-green-200 transition-colors"
                  >
                    <FoodImage
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 flex-shrink-0 rounded-xl object-cover mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                      
                      {/* Customization Badges */}
                      <div className="flex flex-wrap items-center gap-1 my-1">
                        {item.selectedSpice && (
                          <span className="inline-flex items-center gap-0.5 rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                            {item.selectedSpice === "hot" ? "🔥 Hot" : item.selectedSpice === "medium" ? "🌶️ Med" : "🌿 Mild"}
                          </span>
                        )}
                        {item.selectedAddons?.map((addon, idx) => (
                          <span key={idx} className="rounded-md bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                            +{addon}
                          </span>
                        ))}
                      </div>

                      {item.specialNote && (
                        <p className="text-[10px] text-gray-400 italic truncate mb-1">
                          "{item.specialNote}"
                        </p>
                      )}

                      <p className="font-bold text-green-700 text-sm">
                        ETB {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => removeItem(itemKey)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-center gap-0.5 rounded-lg bg-white border border-gray-200 px-0.5 py-0.5">
                        <button
                          onClick={() => decrementItem(itemKey)}
                          className="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-100 transition"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementItem(itemKey)}
                          className="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-100 transition"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — always pinned to bottom, never scrolls away */}
        {cartItems.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            {/* Price breakdown */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">ETB {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-900">ETB {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-1.5">
                <span className="font-extrabold text-gray-900">Total</span>
                <span className="font-extrabold text-green-700 text-base">ETB {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              to="/checkout"
              onClick={onClose}
              id="cart-drawer-checkout"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-600/25 hover:bg-green-700 transition-all active:scale-[0.98]"
            >
              Proceed to Checkout
              <ArrowRight className="h-5 w-5" />
            </Link>

            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-red-400 hover:text-red-600 font-medium transition-colors py-0.5"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
