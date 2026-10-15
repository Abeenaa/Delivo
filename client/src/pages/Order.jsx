import { useState, useEffect } from "react";
import { Search, Plus, Minus, ShoppingCart, Star, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import FoodImage from "../components/FoodImage";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { foodAPI } from "../services/api";

const categories = ["All", "Main Dishes", "Appetizers", "Drinks"];

const Order = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [allFoodItems, setAllFoodItems] = useState([]);
  const { addItem, cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load food items - always show defaults + admin items at the end
  useEffect(() => {
    const loadFoodItems = async () => {
      // Default items based on available images - always show these FIRST
      const defaultItems = [
        {
          id: 1001,
          name: "Spiced Kitfo Platter",
          price: 185,
          image: "/assets/spiceed kitifo.jpg",
          description: "Finely chopped prime beef, seasoned with mitmita and niter kibbeh.",
          category: "Main Dishes",
          rating: "4.9",
        },
        {
          id: 1002,
          name: "Bayenetu Platter",
          price: 150,
          image: "/assets/bayanetu.jpg",
          description: "Our signature vegetarian combination: 8 unique vegetable wats.",
          category: "Main Dishes",
          rating: "4.8",
        },
        {
          id: 1003,
          name: "Classic Doro Wat",
          price: 210,
          image: "/assets/doro wat.jpg",
          description: "The king of Ethiopian stews. Slow-simmered chicken and egg.",
          category: "Main Dishes",
          rating: "4.9",
        },
        {
          id: 1004,
          name: "Gourmet Burger",
          price: 95,
          image: "/assets/burger.jpg",
          description: "Juicy beef patty with fresh vegetables and special sauce.",
          category: "Main Dishes",
          rating: "4.6",
        },
        {
          id: 1005,
          name: "Margherita Pizza",
          price: 140,
          image: "/assets/pizza.jpg",
          description: "Classic Italian pizza with fresh mozzarella and basil.",
          category: "Main Dishes",
          rating: "4.7",
        },
        {
          id: 1006,
          name: "Fresh Beverages",
          price: 40,
          image: "/assets/Drinks.jpg",
          description: "Refreshing drinks including fresh juices and traditional beverages.",
          category: "Drinks",
          rating: "4.5",
        },
      ];

      let adminAddedItems = [];

      // Try to get admin items from API first
      try {
        const response = await foodAPI.getAll();
        if (response.success && response.data.length > 0) {
          // Get default item IDs to avoid duplicates
          const defaultItemIds = defaultItems.map(item => item.id);
          
          // Filter out default items (IDs 1001-1006) to avoid duplicates
          const adminOnlyItems = response.data.filter(item => !defaultItemIds.includes(item.id));
          
          // Convert API data to frontend format, newest items at the end
          adminAddedItems = adminOnlyItems
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // oldest first = end of list
            .map(item => ({
              id: item.id,
              name: item.name,
              price: parseFloat(item.price),
              image: item.image_url,  // base64 or URL directly from DB
              description: item.description,
              category: item.category,
              rating: item.rating?.toString() || "4.5",
            }));
        }
      } catch (error) {
        console.error('Failed to load food items from API:', error);
      }
      
      // ALWAYS: Default items first + Admin items at the end
      const allItems = [...defaultItems, ...adminAddedItems];
      setAllFoodItems(allItems);
    };

    loadFoodItems();
  }, []);

  // Filter food items
  const filteredItems = allFoodItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleQuantityChange = (itemId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    addItem({
      id: item.id,
      name: item.name,
      subtitle: item.category,
      description: item.description,
      image: item.image,
      price: parseFloat(item.price),
      quantity,
    });
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };

  const getCartQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl sm:text-5xl">
              Order Food
            </h1>
            <p className="mt-3 text-gray-600">
              Browse our menu and add items to your cart
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dishes..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
                    selectedCategory === category
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Food Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const qty = quantities[item.id] || 0;
                const inCart = getCartQuantity(item.id);
                
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative">
                      <FoodImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {inCart > 0 && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {inCart} in cart
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 flex-1 group-hover:text-green-600 transition-colors duration-300">{item.name}</h3>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="font-semibold">{item.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-green-600">
                          ETB {item.price}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-1 hover:bg-gray-200 rounded transition"
                            disabled={qty === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{qty || 1}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-1 hover:bg-gray-200 rounded transition"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Floating Checkout Bar - shows when cart has items */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-gray-200 shadow-2xl sm:hidden">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-between bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-700 transition"
            >
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{cartItems.reduce((s, i) => s + i.quantity, 0)} items</span>
              <span>Proceed to Checkout</span>
              <ShoppingCart className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/login', { state: { from: { pathname: '/checkout' } } })}
              className="w-full flex items-center justify-between bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-700 transition"
            >
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{cartItems.reduce((s, i) => s + i.quantity, 0)} items</span>
              <span>Login to Checkout</span>
              <LogIn className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Order;
