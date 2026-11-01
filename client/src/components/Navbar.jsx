import React, { useState, useEffect, useCallback } from "react";
import { LogOut, Search, ShoppingCart, Menu, X, Moon, Sun } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";
import CartDrawer from "./CartDrawer";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "text-green-900 border-b-2 border-green-900 pb-1"
    : "hover:text-green-900 transition-colors";

const loginButtonClass =
  "hidden sm:inline-flex rounded-full border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-900 hover:bg-green-50 transition-all active:scale-95";

const signupButtonClass =
  "hidden sm:inline-flex rounded-full bg-green-900 px-4 py-2 text-sm text-white font-semibold hover:bg-green-800 transition-all shadow-[0_10px_24px_rgba(22,101,52,0.35)] active:scale-95";

const mobileLinkClass =
  "rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-900 transition-colors";

const Navbar = () => {
  const { itemCount } = useCart();
  const { isAuthenticated, profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("delivo-theme") === "dark");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
  }, [location.pathname]);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("delivo-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("delivo-theme", "light");
    }
  }, [isDark]);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/order?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
      }
    },
    [navigate, searchQuery]
  );

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white/85 backdrop-blur-md transition-shadow duration-300 ${
          isScrolled ? "navbar-scrolled" : ""
        }`}
      >
        <nav className="flex items-center justify-between px-3 py-3 sm:px-4 md:px-6 md:py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" textVisibilityClass="hidden sm:inline" />
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/order" className={navLinkClass}>
              Menu
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact Us
            </NavLink>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex w-full max-w-md items-center rounded-full bg-green-50 px-4 py-2 gap-2"
          >
            <input
              id="navbar-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, restaurants, cuisines..."
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400 outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="text-gray-400 hover:text-green-700 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Icons & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NavLink
              to="/order-history"
              className={({ isActive }) =>
                `hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-900"
                }`
              }
            >
              My Orders
            </NavLink>

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle"
              onClick={() => setIsDark((d) => !d)}
              className="hidden sm:flex rounded-full p-2 text-gray-600 transition-colors hover:bg-green-50"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Cart icon — opens drawer */}
            <button
              id="cart-icon-button"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2 transition-colors hover:bg-green-50"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-800 px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-900 ring-2 ring-green-200">
                  {profile?.initials || "U"}
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-white px-3 py-2 text-xs font-semibold text-green-800 hover:bg-green-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className={loginButtonClass}>
                  Login
                </Link>
                <Link to="/signup" className={signupButtonClass}>
                  Sign Up
                </Link>
              </>
            )}

            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="inline-flex rounded-full p-2 text-gray-700 transition-colors hover:bg-green-50 md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen ? (
          <div className="border-t border-green-100 bg-white px-3 pb-4 pt-2 md:hidden">
            {/* Mobile search */}
            <form onSubmit={handleSearchSubmit} className="mb-3 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-2">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none placeholder:text-gray-400"
              />
            </form>

            <div className="flex flex-col gap-1">
              <NavLink to="/" end className={mobileLinkClass}>
                Home
              </NavLink>
              <NavLink to="/order" className={mobileLinkClass}>
                Menu
              </NavLink>
              <NavLink to="/order-history" className={mobileLinkClass}>
                My Orders
              </NavLink>
              <NavLink to="/contact" className={mobileLinkClass}>
                Contact Us
              </NavLink>
            </div>

            {isAuthenticated ? (
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3">
                <div>
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-green-900">
                    {profile?.displayName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-green-900"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-green-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
