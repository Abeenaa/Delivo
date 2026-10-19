import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  DollarSign,
  ChefHat,
  Eye,
  LogOut,
  X,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { foodAPI, adminAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingSpinner from "../components/LoadingSpinner";

const OrderCard = ({ order, expanded, onToggle, onStatusChange, getStatusBadge, getStatusIcon }) => (
  <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${expanded ? 'border-green-200 shadow-md' : 'border-gray-100 hover:border-green-100 hover:shadow-md'}`}>
    {/* Collapsed Row */}
    <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
      {/* Order ID */}
      <div className="flex-shrink-0 w-14 sm:w-16">
        <p className="text-xs font-bold text-gray-900">#{order.id}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
      </div>

      {/* Customer + items */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{order.customer_name || order.delivery_name}</p>
        <p className="text-xs text-gray-400 truncate hidden sm:block">
          {order.items?.map(i => i.name).join(', ') || 'No items'}
        </p>
      </div>

      {/* Total */}
      <p className="text-sm font-bold text-green-600 flex-shrink-0 hidden sm:block">
        ETB {parseFloat(order.total_amount).toFixed(2)}
      </p>

      {/* Status */}
      <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
        {getStatusIcon(order.status)}
        <span className="hidden md:inline capitalize">{order.status}</span>
      </span>

      {/* Expand Button - visually prominent */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${expanded
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white hover:shadow-md'
          }`}
      >
        {expanded ? (
          <><ChevronUp className="h-3.5 w-3.5" /><span className="hidden sm:inline">Hide</span></>
        ) : (
          <><ChevronDown className="h-3.5 w-3.5" /><span className="hidden sm:inline">Details</span></>
        )}
      </button>
    </div>

    {/* Expanded Panel */}
    {expanded && (
      <div className="border-t border-green-100 bg-gradient-to-b from-green-50/50 to-white px-4 py-5 sm:px-6 space-y-4">
        {/* Delivery Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Customer</p>
              <p className="text-sm font-bold text-gray-900 truncate">{order.delivery_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
              <Phone className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Phone</p>
              <a href={`tel:${order.delivery_phone}`} className="text-sm font-bold text-blue-600 hover:underline truncate block">
                {order.delivery_phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Address</p>
              <p className="text-sm font-bold text-gray-900 truncate">{order.delivery_address}</p>
            </div>
          </div>
        </div>

        {/* Items + Status row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Items */}
          <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Items Ordered</p>
            <div className="space-y-1.5">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700 truncate">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="font-semibold text-gray-900 ml-2 flex-shrink-0">ETB {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100 mt-2">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-green-600">ETB {parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="sm:w-48 bg-white rounded-xl border border-gray-100 p-4 flex flex-col justify-between gap-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Update Status</p>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white font-medium"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    )}
  </div>
);

const Admin = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Main Dishes",
    price: "",
    stock_status: "Available",
    rating: "4.5",
    description: "",
    image_url: "", // No default image
  });

  // Check authentication and load data on mount
  useEffect(() => {
    const isAdminAuth = localStorage.getItem("adminAuth");
    if (!isAdminAuth) {
      navigate("/login");
      return;
    }

    // Load data
    loadFoodItems();
    loadOrders();
    loadStats();

    // Auto-refresh orders every 30 seconds
    const interval = setInterval(() => {
      loadOrders();
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  const loadFoodItems = async () => {
    try {
      const response = await foodAPI.getAll();
      if (response.success) {
        setFoodItems(response.data);
      }
    } catch (error) {
      console.error('Failed to load food items:', error);
      // Fallback to localStorage
      const savedItems = localStorage.getItem("adminFoodItems");
      if (savedItems) {
        setFoodItems(JSON.parse(savedItems));
      }
    }
  };

  const loadOrders = async () => {
    try {
      const response = await adminAPI.getAllOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminEmail");
    navigate("/login");
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showError("Image size should be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showError("Please upload an image file");
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result }));
        showSuccess("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Attempting to add food item:', formData);
      console.log('Admin token:', localStorage.getItem('adminToken'));
      console.log('Admin auth:', localStorage.getItem('adminAuth'));

      const response = await foodAPI.create(formData);
      if (response.success) {
        await loadFoodItems(); // Reload items
        setShowAddModal(false);
        resetForm();
        showSuccess('Food item added successfully!');
      }
    } catch (error) {
      console.error('Failed to add food item:', error);
      showError(`Failed to add food item: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await foodAPI.update(currentItem.id, formData);
      if (response.success) {
        await loadFoodItems(); // Reload items
        setShowEditModal(false);
        setCurrentItem(null);
        resetForm();
        showSuccess('Food item updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update food item:', error);
      showError(`Failed to update food item: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await foodAPI.delete(id);
      if (response.success) {
        await loadFoodItems(); // Reload items
        showSuccess('Food item deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete food item:', error);
      showError(`Failed to delete food item: ${error.message}`);
    }
  };

  const openDeleteDialog = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDeleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleRefreshOrders = async () => {
    setIsRefreshing(true);
    try {
      await loadOrders();
      await loadStats();
      showSuccess('Orders refreshed successfully!');
    } catch (error) {
      showError('Failed to refresh orders');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        await loadOrders();
        showSuccess(`Order #${orderId} status updated to ${newStatus}`);
      }
    } catch (error) {
      showError('Failed to update order status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Main Dishes",
      price: "",
      stock_status: "Available",
      rating: "4.5",
      description: "",
      image_url: "",
    });
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      stock_status: item.stock_status || item.stock || "Available",
      rating: item.rating,
      description: item.description || "",
      image_url: item.image_url || item.image || "",
    });
    setShowEditModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };
  // Use real stats or fallback to mock data
  const displayStats = [
    {
      label: "Total Orders",
      value: stats.totalOrders || "0",
      change: "+12%",
      icon: ShoppingBag,
      color: "bg-blue-500"
    },
    {
      label: "Total Revenue",
      value: stats.totalRevenue ? `ETB ${stats.totalRevenue.toFixed(2)}` : "ETB 0.00",
      change: "+8%",
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      label: "Active Users",
      value: stats.totalCustomers || "0",
      change: "+23%",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      label: "Food Items",
      value: stats.totalFoodItems || foodItems.length.toString(),
      change: "+5",
      icon: Package,
      color: "bg-orange-500"
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      delivered: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      preparing: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "preparing": return <ChefHat className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };
  return (
    <div className="min-h-screen bg-[#f0fdf4] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-green-600">
          <h1 className="text-xl font-bold text-white">Delivo Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${activeTab === "dashboard"
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${activeTab === "orders"
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <ShoppingBag className="h-5 w-5" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab("foods")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${activeTab === "foods"
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Package className="h-5 w-5" />
            Food Items
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900 lg:hidden">Delivo Admin</h2>
            <h2 className="hidden lg:block text-2xl font-bold text-gray-900">
              {activeTab === "dashboard" ? "Dashboard" : activeTab === "orders" ? "Orders" : "Food Items"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="lg:hidden p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-2">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${activeTab === "dashboard"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${activeTab === "orders"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab("foods")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${activeTab === "foods"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              <Package className="h-4 w-4" />
              Food Items
            </button>
          </div>
        </div>
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-8">

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {displayStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="group bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`${stat.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-sm text-green-600 hover:text-green-700 font-semibold">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      expanded={expandedOrder === order.id}
                      onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      onStatusChange={handleUpdateStatus}
                      getStatusBadge={getStatusBadge}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                  {orders.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No orders yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search orders by customer name or order ID..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <button
                  onClick={handleRefreshOrders}
                  disabled={isRefreshing}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
                  <svg
                    className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition">
                  <Filter className="h-5 w-5" />
                  Filter
                </button>
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {orders.length > 0 ? orders
                  .filter(order => {
                    if (!searchQuery) return true;
                    const query = searchQuery.toLowerCase();
                    const customerName = (order.customer_name || order.delivery_name || '').toLowerCase();
                    const orderId = order.id.toString();
                    return customerName.includes(query) || orderId.includes(query);
                  })
                  .map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      expanded={expandedOrder === order.id}
                      onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      onStatusChange={handleUpdateStatus}
                      getStatusBadge={getStatusBadge}
                      getStatusIcon={getStatusIcon}
                    />
                  )) : (
                  <div className="bg-white rounded-2xl py-12 text-center text-gray-500 border border-gray-100">
                    {searchQuery ? 'No orders found matching your search' : 'No orders yet'}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Food Items Tab */}
          {activeTab === "foods" && (
            <div className="space-y-6">
              {/* Search & Add */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search food items..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <button
                  onClick={openAddModal}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg">
                  <Plus className="h-5 w-5" />
                  Add Food Item
                </button>
              </div>

              {/* Food Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {foodItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300"
                  >
                    {/* Food Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.image_url || item.image || "/assets/food.png"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/assets/food.png";
                        }}
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-white/90 text-yellow-700 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">
                        <TrendingUp className="h-3 w-3" />
                        {item.rating}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-green-600">ETB {item.price}</span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${(item.stock_status || item.stock) === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                          }`}>
                          {item.stock_status || item.stock || "Available"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-semibold hover:bg-green-100 transition">
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(item)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">Add Food Item</h2>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    placeholder="Food name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={handleInputChange("description")}
                    placeholder="Describe the dish..."
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {formData.image_url && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <label className="block cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
                        <div className="p-3 bg-green-100 rounded-full">
                          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-700">Click to upload image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 2MB</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        required={!formData.image_url}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={handleInputChange("category")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="Main Dishes">Main Dishes</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETB) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={handleInputChange("price")}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status *</label>
                  <select
                    value={formData.stock_status}
                    onChange={handleInputChange("stock_status")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={handleInputChange("rating")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading && <LoadingSpinner size="sm" />}
                    {isLoading ? 'Adding...' : 'Add Item'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Edit Item Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">Edit Food Item</h2>
              <form onSubmit={handleEditItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    placeholder="Food name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={handleInputChange("description")}
                    placeholder="Describe the dish..."
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {formData.image_url && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <label className="block cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
                        <div className="p-3 bg-green-100 rounded-full">
                          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-700">Click to upload image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 2MB</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        required={!formData.image_url}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={handleInputChange("category")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="Main Dishes">Main Dishes</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETB) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={handleInputChange("price")}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status *</label>
                  <select
                    value={formData.stock_status}
                    onChange={handleInputChange("stock_status")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={handleInputChange("rating")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading && <LoadingSpinner size="sm" />}
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Food Item"
          message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

      </div>
    </div>
  );
};

export default Admin;