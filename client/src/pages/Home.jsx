import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryItem from "../components/CategoryItem";
import Footer from "../components/Footer";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Star,
  Heart,
  Clock,
  Users,
  ChefHat,
  Zap,
  Award,
  Globe,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Flame,
  Search,
  Check,
  Copy,
  Navigation,
  CreditCard,
  Bike,
  Smartphone,
  Quote,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const QUICK_DIETARY_CHIPS = [
  { label: "🌱 Fasting / Vegan (Tsom)", query: "Bayenetu", badge: "Healthy" },
  { label: "🔥 Spicy Mitmita Kitfo", query: "Kitfo", badge: "Popular" },
  { label: "🍗 Doro Wat Classics", query: "Doro", badge: "Chef's Pick" },
  { label: "🍕 Crispy Pizza", query: "Pizza" },
  { label: "🍔 Gourmet Burgers", query: "Burger" },
  { label: "🍹 Chilled Drinks", query: "Drinks" },
];

const TESTIMONIALS = [
  {
    name: "Dr. Selamawit T.",
    location: "Kazanchis, Addis Ababa",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    dish: "Classic Doro Wat Platter",
    rating: 5,
    quote: "The Doro Wat arrived piping hot in Kazanchis within 22 minutes! The live GPS tracking map made it super easy to meet the rider at our gate.",
  },
  {
    name: "Dawit Mengistu",
    location: "Bole Medhanialem",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    dish: "Spiced Kitfo (Hot Mitmita + Ayib)",
    rating: 5,
    quote: "Being able to customize the spice level and add extra fresh ayib directly in the modal is a total game changer. My office orders every Friday.",
  },
  {
    name: "Kalkidan Assefa",
    location: "Sarbet, Old Airport",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    dish: "Bayenetu Vegan Feast",
    rating: 5,
    quote: "Authentic fasting wats that taste just like home. Paid with Chapa in under 15 seconds. Seamless ordering from start to finish!",
  },
];

const Home = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { addItem } = useCart();

  React.useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const categories = [
    { label: "Ethiopian", image: "/assets/bayanetu.jpg", active: true },
    { label: "Pizza", image: "/assets/pizza.jpg" },
    { label: "Burgers", image: "/assets/burger.jpg" },
    { label: "Drinks", image: "/assets/Drinks.jpg" },
  ];

  const trendingItems = [
    {
      id: 1001,
      title: "Spiced Kitfo Platter",
      price: "185",
      image: "/assets/spiceed kitifo.jpg",
      description: "Finely chopped prime beef, seasoned with mitmita and niter kibbeh.",
      category: "Main Dishes",
      rating: "4.9",
      badge: "Best Seller",
      badgeColor: "bg-orange-400 text-gray-900",
      time: "25 min",
    },
    {
      id: 1002,
      title: "Bayenetu Platter",
      price: "150",
      image: "/assets/bayanetu.jpg",
      description: "Our signature vegetarian combination: 8 unique vegetable wats.",
      category: "Main Dishes",
      rating: "4.8",
      badge: "Vegan Fave",
      badgeColor: "bg-green-500 text-white",
      time: "20 min",
    },
    {
      id: 1003,
      title: "Classic Doro Wat",
      price: "210",
      image: "/assets/doro wat.jpg",
      description: "The king of Ethiopian stews. Slow-simmered chicken and egg.",
      category: "Main Dishes",
      rating: "4.9",
      badge: "Chef's Pick",
      badgeColor: "bg-purple-500 text-white",
      time: "35 min",
    },
    {
      id: 1004,
      title: "Gourmet Burger",
      price: "95",
      image: "/assets/burger.jpg",
      description: "Juicy beef patty with fresh vegetables and special sauce.",
      category: "Main Dishes",
      rating: "4.6",
      badge: "Popular",
      badgeColor: "bg-blue-500 text-white",
      time: "15 min",
    },
    {
      id: 1005,
      title: "Margherita Pizza",
      price: "140",
      image: "/assets/pizza.jpg",
      description: "Classic Italian pizza with fresh mozzarella and basil.",
      category: "Main Dishes",
      rating: "4.7",
      badge: "New",
      badgeColor: "bg-red-500 text-white",
      time: "30 min",
    },
    {
      id: 1006,
      title: "Fresh Beverages",
      price: "40",
      image: "/assets/Drinks.jpg",
      description: "Refreshing drinks including fresh juices and traditional beverages.",
      category: "Drinks",
      rating: "4.5",
      badge: "Refreshing",
      badgeColor: "bg-cyan-500 text-white",
      time: "5 min",
    },
  ];

  const scrollCategories = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 220, behavior: "smooth" });
    }
  };

  const handleQuickAdd = (item) => {
    addItem({
      id: item.id,
      name: item.title,
      subtitle: item.category,
      description: item.description,
      image: item.image,
      price: parseFloat(item.price),
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans selection:bg-green-200 scroll-smooth animate-page-in">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-12 pt-0 sm:px-6 sm:gap-16">
        {/* ─── Hero Section ─── */}
        <section className="relative flex items-center overflow-hidden rounded-4xl bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 shadow-2xl sm:rounded-[3rem] md:min-h-125">
          <div className="relative z-10 flex w-full flex-col items-center gap-8 px-5 py-10 sm:px-8 md:flex-row md:gap-12 md:px-12">
            <div className="flex-1 text-white flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-orange-400 text-gray-950 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  Addis Ababa's Favorite
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  Live GPS Radar
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">
                The Soul of <br />
                <span className="text-orange-400">Ethiopian Spices.</span>
              </h1>

              <p className="max-w-md text-base leading-relaxed text-green-100 opacity-90 sm:text-lg">
                Sizzling Kitfo, fragrant Doro Wat, and artisanal Injera delivered
                hot to your doorstep with real-time courier tracking.
              </p>

              <Link
                to="/order"
                className="flex w-fit items-center gap-3 rounded-full bg-white px-7 py-3.5 font-bold text-green-900 shadow-lg transition-all hover:gap-5 hover:bg-green-50 active:scale-95 sm:px-10 sm:py-4 text-sm sm:text-base mt-1"
              >
                Order Now <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Guarantees micro-pill */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-green-200/90 pt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-400" />
                  25 min avg arrival
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  4.9★ from 5,000+ orders
                </span>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute -right-28 -top-24 hidden h-105 w-105 rounded-full bg-red-600 opacity-20 blur-[100px] sm:block md:h-150 md:w-150"></div>
              <div className="relative z-20 w-fit mx-auto animate-float">
                <img
                  src="/assets/hero-burger.png"
                  alt="Ethiopian Gourmet Platter"
                  className="w-52 sm:w-72 object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] sm:w-95 md:w-120"
                />
              </div>
            </div>
          </div>
          {/* Decorative skew */}
          <div className="absolute right-0 top-0 hidden h-full w-1/3 translate-x-1/2 bg-red-700/10 -skew-x-12 md:block"></div>
        </section>

        {/* ─── Dietary & Craving Quick-Filter Chips ─── */}
        <section className="-mt-4 sm:-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-green-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Popular Cravings & Diets
            </h3>
          </div>

          <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto pb-2 px-1">
            {QUICK_DIETARY_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(`/order?search=${encodeURIComponent(chip.query)}`)}
                className="group flex-shrink-0 flex items-center gap-2 rounded-2xl border border-green-200/80 bg-white px-4 py-2.5 text-xs font-bold text-gray-800 shadow-xs hover:border-green-600 hover:bg-green-50/80 hover:text-green-900 hover:shadow-md transition-all active:scale-95"
              >
                <span>{chip.label}</span>
                {chip.badge && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-extrabold text-green-800 group-hover:bg-green-600 group-hover:text-white transition">
                    {chip.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ─── Explore Cuisines ─── */}
        <section>
          <div className="mb-6 flex items-center justify-between sm:mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Explore Cuisines
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                From authentic wats to modern street food favorites
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCategories(-1)}
                className="p-3 bg-white rounded-full text-gray-500 hover:text-green-900 shadow-sm border border-gray-100 transition-all hover:bg-gray-50"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCategories(1)}
                className="p-3 bg-green-900 rounded-full text-white shadow-md transition-all hover:bg-green-800"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="no-scrollbar flex items-center gap-6 overflow-x-auto px-1 pb-4 sm:gap-8 sm:px-2"
          >
            {categories.map((cat, idx) => (
              <CategoryItem key={idx} {...cat} />
            ))}
          </div>
        </section>

        {/* ─── Trust & Guarantee Badges (Senior Product Touch) ─── */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Clock,
              color: "text-amber-600 bg-amber-50",
              title: "25-Min Hot Dispatch",
              desc: "Cooked to order and dispatched hot in insulated thermal packs.",
            },
            {
              icon: Navigation,
              color: "text-emerald-600 bg-emerald-50",
              title: "Live GPS Radar Tracking",
              desc: "Watch your courier drive on our real-time interactive map.",
            },
            {
              icon: CreditCard,
              color: "text-blue-600 bg-blue-50",
              title: "Instant Secure Payment",
              desc: "Pay seamlessly with Chapa, Telebirr, or Cash on Delivery.",
            },
            {
              icon: ChefHat,
              color: "text-purple-600 bg-purple-50",
              title: "Customized Spice Levels",
              desc: "Select Mild, Medium, or authentic Mitmita Heat for every dish.",
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3.5 rounded-3xl bg-white p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ─── Trending Now Section ─── */}
        <section className="mb-2">
          <div className="mb-6 flex items-center justify-between sm:mb-8">
            <div>
              <h2 className="flex items-center gap-2.5 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                <Flame className="h-7 w-7 text-orange-500" />
                Trending Dishes
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Most loved culinary selections ordered this week in Addis
              </p>
            </div>
            <Link
              to="/order"
              className="text-green-700 font-bold hover:underline text-sm uppercase tracking-wider flex items-center gap-1"
            >
              View Full Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4 px-1">
            {trendingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate("/order")}
                className="group flex-shrink-0 w-64 bg-white rounded-3xl overflow-hidden shadow-md border border-green-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = "/assets/food.png"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {/* Badge */}
                  <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  {/* Time */}
                  <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-800 backdrop-blur-xs">
                    <Clock className="h-3 w-3 text-green-600" />
                    {item.time}
                  </span>
                  {/* Rating */}
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-800 backdrop-blur-xs">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {item.rating}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-base font-extrabold text-green-700">
                      ETB {parseFloat(item.price).toFixed(2)}
                    </span>
                    <button
                      id={`trending-add-${item.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(item);
                      }}
                      className="flex items-center gap-1.5 rounded-full bg-green-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-green-800 transition-all active:scale-95 shadow-sm"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Interactive "How Delivo Works" (3-Step Experience) ─── */}
        <section className="rounded-3xl bg-white p-6 sm:p-10 border border-green-100 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3.5 py-1 text-xs font-extrabold text-green-800 uppercase tracking-wider mb-2">
              Effortless Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              How Delivo Brings Food to You
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Three simple steps from authentic kitchen prep to your front gate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              {
                step: "01",
                icon: Utensils,
                title: "Customize & Order",
                desc: "Pick your favorite traditional or modern dishes. Choose your spice level, extra injera, and toppings with real-time price updates.",
              },
              {
                step: "02",
                icon: CreditCard,
                title: "Instant Local Pay",
                desc: "Pay securely via Chapa with Telebirr, CBE Birr, debit cards, or select Cash on Delivery with no advance fee.",
              },
              {
                step: "03",
                icon: Bike,
                title: "Live GPS Radar",
                desc: "Watch your courier ride towards your location in real time with continuous ETA updates and instant courier contact.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="relative rounded-2xl bg-gradient-to-b from-green-50/50 to-white p-6 border border-green-100/80 flex flex-col items-center text-center hover:shadow-md transition-all group"
              >
                <span className="absolute top-4 right-4 text-2xl font-black text-green-200 group-hover:text-green-300 transition-colors">
                  {step}
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/30 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2">{title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Verified Customer Social Proof & Testimonials ─── */}
        <section>
          <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-green-700">
                <Star className="h-3.5 w-3.5 fill-green-600 text-green-600" />
                Loved by Addis Foodies
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                What Customers Say
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Verified reviews from our community across Addis Ababa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative"
              >
                <div>
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed mb-4">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-green-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-green-600" />
                        {t.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Mobile Experience / Scan to Order Card ─── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-900 p-6 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 mb-3">
                <Smartphone className="h-3.5 w-3.5" />
                Mobile Optimized
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Order Lunch in Seconds on Your Phone
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                Responsive, lightning fast, and requires no heavy app store downloads.
                Browse the menu, track your rider, and reorder past favorites on any smartphone.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link
                  to="/order"
                  className="rounded-full bg-green-500 px-6 py-3 text-xs sm:text-sm font-bold text-gray-950 hover:bg-green-400 transition shadow-lg active:scale-95"
                >
                  Browse Mobile Menu
                </Link>
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Instant Web App Ready
                </span>
              </div>
            </div>

            {/* QR Mockup visual badge */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-gray-900 shadow-2xl text-center">
              <div className="h-28 w-28 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center p-2 mb-2">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://delivo-delivery.com"
                  alt="Delivo QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <p className="text-[11px] font-bold text-gray-800">Scan to Open Menu</p>
              <p className="text-[10px] text-gray-400">Works with camera</p>
            </div>
          </div>
        </section>

        {/* ─── About Section (Preserved & Enhanced) ─── */}
        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              About Delivo
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
              Bringing Ethiopian culinary heritage to your door with modern engineering speed
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: ChefHat, value: "24+", label: "Partner Restaurants" },
              { icon: Users,   value: "5,000+", label: "Happy Customers" },
              { icon: Clock,   value: "25 min", label: "Avg Delivery Time" },
              { icon: Star,    value: "4.9/5",  label: "Customer Rating" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="group bg-white rounded-2xl p-5 shadow-xs border border-gray-100 hover:shadow-md hover:border-green-200 transition-all"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-4 z-30 hidden sm:block sm:bottom-10 sm:right-10">
        <Link
          to="/order"
          className="flex items-center gap-2 bg-green-900 text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 transition-transform hover:bg-green-800 group font-semibold text-sm"
        >
          <Utensils className="w-5 h-5 group-hover:animate-bounce" />
          Order Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
