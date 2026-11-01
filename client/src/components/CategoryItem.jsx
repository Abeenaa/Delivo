import React from 'react';
import { Link } from 'react-router-dom';

const CategoryItem = ({ image, label, active }) => {
  const query = label === "Ethiopian" ? "Platter" : label;

  return (
    <Link
      to={`/order?search=${encodeURIComponent(query)}`}
      className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0"
    >
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 ${active ? 'bg-green-200 ring-4 ring-green-100' : 'bg-green-100 group-hover:bg-green-200 group-hover:scale-105 shadow-xs'}`}>
        <img 
          src={image} 
          alt={label} 
          className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300" 
        />
      </div>
      <span className={`text-sm font-semibold transition-colors ${active ? 'text-green-900 font-bold' : 'text-gray-700 group-hover:text-green-800'}`}>
        {label}
      </span>
    </Link>
  );
};

export default CategoryItem;
