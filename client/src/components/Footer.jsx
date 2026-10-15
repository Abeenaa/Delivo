import React from "react";
import { Send, Facebook, Twitter, Instagram, Globe } from "lucide-react";
import BrandLogo from "./BrandLogo";

const Footer = () => {
  return (
    <footer className="bg-green-50 pt-12 pb-8 px-4 sm:px-6 border-t border-green-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <BrandLogo size="md" clickable={false} />
          <p className="text-gray-600 text-sm leading-relaxed">
            Celebrating the rich culinary heritage of Ethiopia with modern
            delivery. From the highlands to your home.
          </p>
          <div className="flex gap-4">
            <button className="p-2 bg-white rounded-full text-green-700 hover:bg-green-700 hover:text-white transition-all shadow-sm">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white rounded-full text-green-700 hover:bg-green-700 hover:text-white transition-all shadow-sm">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white rounded-full text-green-700 hover:bg-green-700 hover:text-white transition-all shadow-sm">
              <Instagram className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">
            Company
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
            <li>
              <a href="#" className="hover:text-green-900">
                Our Story
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-900">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-900">
                Partner With Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-900">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">
            Support
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
            <li>
              <a href="#" className="hover:text-green-900">
                Delivery Areas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-900">
                Contact Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-900">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-900">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h3 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">
            Newsletter
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Join our culinary inner circle for exclusive offers.
          </p>
          <div className="relative">
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-white border border-green-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
            />
            <button className="absolute right-2 top-2 p-2 bg-green-900 text-white rounded-xl hover:bg-green-800 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-green-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium text-center md:text-left">
        <p>© 2024 AbdiDelivery Ethiopian Gastronomy. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <a href="#" className="hover:text-gray-600">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-600">
            Cookie Settings
          </a>
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
