import { Eye, EyeOff, Mail, Lock, User, Phone, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // If redirected from a protected route (e.g. /checkout), go back there after login
  const from = location.state?.from?.pathname || "/";
  // Hide admin toggle when redirected from a protected customer route
  const isCustomerRedirect = !!location.state?.from;
  const isSignup = location.pathname === "/signup";
  const { signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isSignup && !isAdminMode && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (isSignup && !isAdminMode && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isAdminMode && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignup && !isAdminMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      if (isAdminMode) {
        // Admin login via API
        const response = await authAPI.adminLogin(formData.email, formData.password);
        if (response.success) {
          localStorage.setItem("adminAuth", "true");
          localStorage.setItem("adminEmail", formData.email);
          // Store the admin token for API calls
          localStorage.setItem("adminToken", response.data.token);
          navigate("/admin");
        }
      } else {
        // Customer login/signup via API
        if (isSignup) {
          const response = await authAPI.register(
            formData.name.trim(),
            formData.email.trim(),
            formData.phone,
            formData.password
          );
          if (response.success) {
            signUp({ email: formData.email.trim(), name: formData.name.trim() });
            navigate(from, { replace: true });
          }
        } else {
          const response = await authAPI.login(formData.email.trim(), formData.password);
          if (response.success) {
            signIn({ email: formData.email.trim(), name: response.data.user.name });
            navigate(from, { replace: true });
          }
        }
      }
    } catch (error) {
      console.error('Login/Register error:', error);
      setErrors({ 
        email: error.message || "Authentication failed", 
        password: error.message || "Authentication failed" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <Navbar />
      
      {/* Background Content - Blurred */}
      <div className="relative">
        <div className="blur-sm pointer-events-none">
          <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-8 pt-2 sm:px-6 sm:gap-16">
            {/* Hero Section */}
            <section className="relative flex items-center overflow-hidden rounded-4xl bg-linear-to-r from-green-900 to-green-800 shadow-2xl sm:rounded-[3rem] md:min-h-120">
              <div className="relative z-10 flex w-full flex-col items-center gap-8 px-5 py-8 sm:px-8 md:flex-row md:gap-12 md:px-12">
                <div className="flex-1 text-white flex flex-col gap-4">
                  <h1 className="text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">
                    The Soul of <br />
                    <span className="text-orange-400">Ethiopian Spices.</span>
                  </h1>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Login Modal Overlay */}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 relative">
              {/* Close Button */}
              <button
                onClick={() => navigate("/")}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isAdminMode ? "Admin Login" : (isSignup ? "Sign Up" : "Login")}
                </h2>
                <p className="mt-1.5 text-sm text-gray-600">
                  {isCustomerRedirect
                    ? "Please login or sign up to complete your order"
                    : isAdminMode 
                      ? "Access the admin dashboard"
                      : isSignup
                        ? "Create your account to get started"
                        : "Welcome back! Please login to your account"}
                </p>
                {isCustomerRedirect && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    🛒 Your cart items are saved
                  </div>
                )}
              </div>

              {/* User Type Toggle - hidden when redirected from checkout */}
              {!isSignup && !isCustomerRedirect && (
                <div className="mb-6 flex gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setIsAdminMode(false)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${
                      !isAdminMode
                        ? "bg-white text-green-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdminMode(true)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${
                      isAdminMode
                        ? "bg-white text-green-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Admin
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {isSignup && !isAdminMode && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleChange("name")}
                        placeholder="Enter your name"
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {isAdminMode ? "Admin Email" : "Email"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleChange("email")}
                      placeholder={isAdminMode ? "Enter admin email" : "Enter your email"}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {isSignup && !isAdminMode && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange("phone")}
                        placeholder="+251 912 345 678"
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-0.5 text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange("password")}
                      placeholder="Enter your password"
                      className={`w-full pl-9 pr-10 py-2.5 text-sm border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-0.5 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                {isSignup && !isAdminMode && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        placeholder="Confirm your password"
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-0.5 text-xs text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {!isSignup && !isAdminMode && (
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="font-medium text-green-600 hover:text-green-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition shadow-lg"
                >
                  {isAdminMode ? "Login to Dashboard" : (isSignup ? "Sign Up" : "Login")}
                </button>
              </form>

              {/* Footer */}
              {!isAdminMode && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-600">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => navigate(isSignup ? "/login" : "/signup")}
                      className="font-semibold text-green-600 hover:text-green-700"
                    >
                      {isSignup ? "Login" : "Sign Up"}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
