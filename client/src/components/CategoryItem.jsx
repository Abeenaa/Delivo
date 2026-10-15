import React from 'react';

const CategoryItem = ({ image, label, active }) => {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer group">
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 ${active ? 'bg-green-200 ring-4 ring-green-100' : 'bg-green-100 group-hover:bg-green-200'}`}>
        <img 
          src={image} 
          alt={label} 
          className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" 
        />
      </div>
      <span className={`text-sm font-semibold ${active ? 'text-green-900' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
  );
};

export default CategoryItem;
