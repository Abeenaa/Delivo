import React from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const Home = () => {
  React.useEffect(() => {
    // Smooth scroll behavior for the whole page
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
      title: "Spiced Kitfo Platter",
      price: "18.50",
      image: "/assets/spiceed kitifo.jpg",
      description:
        "Finely chopped prime beef, seasoned with mitmita and niter kibbeh.",
    },
    {
      title: "Bayenetu Platter",
      price: "15.00",
      image: "/assets/bayanetu.jpg",
      description:
        "Our signature vegetarian combination: 8 unique vegetable wats.",
    },
    {
      title: "Classic Doro Wat",
      price: "21.00",
      image: "/assets/doro wat.jpg",
      description:
        "The king of Ethiopian stews. Slow-simmered chicken and egg.",
    },
    {
      title: "Ceremonial Coffee Kit",
      price: "12.00",
      image: "/assets/food.png",
      description: "Roasted Yirgacheffe beans served with incense and snacks.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans selection:bg-green-200 scroll-smooth">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-8 pt-2 sm:px-6 sm:gap-16">
        {/* Hero Section */}
        <section className="relative flex items-center overflow-hidden rounded-4xl bg-linear-to-r from-green-900 to-green-800 shadow-2xl sm:rounded-[3rem] md:min-h-120">
          <div className="relative z-10 flex w-full flex-col items-center gap-8 px-5 py-8 sm:px-8 md:flex-row md:gap-12 md:px-12">
            <div className="flex-1 text-white flex flex-col gap-4">
              <span className="bg-orange-400 text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full w-fit uppercase tracking-widest">
                Limited Time Offer
              </span>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">
                The Soul of <br />
                <span className="text-orange-400">Ethiopian Spices.</span>
              </h1>
              <p className="max-w-md text-base leading-relaxed text-green-100 opacity-90 sm:text-lg">
                Experience the depth of Doro Wat and artisanal Injera, delivered
                with modern speed. Get 30% off your first traditional platter.
              </p>
              <Link 
                to="/order"
                className="flex w-fit items-center gap-3 rounded-full bg-white px-7 py-3 font-bold text-green-900 shadow-lg transition-all hover:gap-5 hover:bg-green-50 active:scale-95 sm:px-10 sm:py-4"
              >
                Order Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex-1 relative">
              <div className="absolute -right-28 -top-24 hidden h-105 w-105 rounded-full bg-red-600 opacity-20 blur-[100px] sm:block md:h-150 md:w-150"></div>
              <div className="relative z-20 w-fit mx-auto animate-float">
                <img
                  src="/assets/hero-burger.png"
                  alt="Ethiopian Platter"
                  className="w-48 sm:w-64 object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] sm:w-95 md:w-120"
                />
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute right-0 top-0 hidden h-full w-1/3 translate-x-1/2 bg-red-700/10 -skew-x-12 md:block"></div>
        </section>

        {/* Explore Cuisines */}
        <section>
          <div className="mb-8 flex items-center justify-between sm:mb-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Explore Cuisines
            </h2>
            <div className="flex gap-4">
              <button className="p-3 bg-white rounded-full text-gray-400 hover:text-green-900 shadow-sm transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-3 bg-green-900 rounded-full text-white shadow-md transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="no-scrollbar flex items-center gap-6 overflow-x-auto px-1 pb-4 sm:gap-8 sm:px-4">
            {categories.map((cat, idx) => (
              <CategoryItem key={idx} {...cat} />
            ))}
          </div>
        </section>

        {/* Popular Near You */}
        <section className="mb-14 sm:mb-20">
          <div className="mb-8 flex items-center justify-between sm:mb-10">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              Popular Near You
            </h2>
            <button className="text-green-700 font-bold hover:underline text-sm uppercase tracking-wider">
              View All
            </button>
          </div>

          <div className="grid h-auto grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Featured House */}
            <div className="lg:col-span-2 relative rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="The Heritage House"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-5 sm:p-10">
                <div className="flex gap-3 mb-4">
                  <span className="bg-orange-400 text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    Premium Choice
                  </span>
                  <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    Free Delivery
                  </span>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white sm:text-4xl">
                  The Heritage House
                </h3>
                <p className="text-gray-300 mb-4 font-medium opacity-90">
                  Masterful Doro Wat & Traditional Spiced Beef
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
                  <div className="flex items-center gap-2 text-white font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-orange-400 fill-current" />
                    4.9 (1.2k+)
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <Utensils className="w-4 h-4" />
                    25-35 min
                  </div>
                </div>
              </div>
            </div>

            {/* Stacked Cards */}
            <div className="flex flex-col gap-6">
              <div className="flex-1 bg-white rounded-4xl p-4 flex flex-col shadow-md overflow-hidden group cursor-pointer border border-green-50">
                <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Verdant Bowls"
                  />
                  <div className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 shadow-sm">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                      Verdant Bowls
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Salads • Healthy • 15 min
                    </p>
                  </div>
                  <div className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                    4.7 ★
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-4xl p-4 flex flex-col shadow-md overflow-hidden group cursor-pointer border border-green-50">
                <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=1000&auto=format&fit=crop"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="The Spice Hub"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                      The Spice Hub
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Grill • Spices • 20 min
                    </p>
                  </div>
                  <div className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                    4.5 ★
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-14 sm:mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              About Delivo
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Bringing Ethiopian kitchens to your door with speed and authenticity
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 mb-4">
                <ChefHat className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">24+</p>
              <p className="text-sm text-gray-600 mt-1">Partner Restaurants</p>
            </div>
            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">5,000+</p>
              <p className="text-sm text-gray-600 mt-1">Happy Customers</p>
            </div>
            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">25 min</p>
              <p className="text-sm text-gray-600 mt-1">Avg Delivery Time</p>
            </div>
            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 mb-4">
                <Star className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">4.9/5</p>
              <p className="text-sm text-gray-600 mt-1">Customer Rating</p>
            </div>
          </div>

          {/* Story & Features */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Story */}
            <div className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-4">Our Story</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Delivo is a project-based food delivery system developed to showcase 
                modern web development practices and create a seamless ordering experience 
                for Ethiopian cuisine enthusiasts.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This platform demonstrates the integration of contemporary technologies 
                with traditional culinary heritage, featuring restaurant browsing, menu 
                exploration, cart management, and user authentication.
              </p>
              <div className="mt-6 flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Heart className="h-3 w-3" />
                  Project-Based
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <ChefHat className="h-3 w-3" />
                  Modern Stack
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <Zap className="h-8 w-8 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 mb-3" />
                <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">Lightning Fast</h4>
                <p className="text-sm text-gray-600">Order in seconds, delivered in minutes</p>
              </div>
              <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <Award className="h-8 w-8 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 mb-3" />
                <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">Quality Assured</h4>
                <p className="text-sm text-gray-600">Only the best restaurants make the cut</p>
              </div>
              <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <Globe className="h-8 w-8 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 mb-3" />
                <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">Wide Coverage</h4>
                <p className="text-sm text-gray-600">Serving all of Addis Ababa</p>
              </div>
              <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <TrendingUp className="h-8 w-8 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 mb-3" />
                <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">Always Growing</h4>
                <p className="text-sm text-gray-600">New restaurants added weekly</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Action Button (Design highlight) */}
      <div className="fixed bottom-6 right-4 z-50 hidden sm:block sm:bottom-10 sm:right-10">
        <button className="bg-green-900 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform hover:rotate-12 group">
          <Utensils className="w-8 h-8 group-hover:animate-bounce" />
        </button>
      </div>
    </div>
  );
};

export default Home;
