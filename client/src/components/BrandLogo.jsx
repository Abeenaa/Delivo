import React from "react";
import { Link } from "react-router-dom";

const sizeMap = {
  sm: {
    icon: "h-7 w-7",
    text: "text-base",
    gap: "gap-2",
  },
  md: {
    icon: "h-8 w-8",
    text: "text-lg",
    gap: "gap-2.5",
  },
  lg: {
    icon: "h-10 w-10",
    text: "text-xl",
    gap: "gap-3",
  },
};

const BrandLogo = ({
  size = "md",
  clickable = true,
  textColor = "text-green-900",
  showText = true,
  textVisibilityClass = "",
}) => {
  const styles = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center ${styles.gap}`}>
      {/* SVG icon — no image file needed */}
      <div className={`${styles.icon} flex items-center justify-center rounded-full bg-green-700 shadow-sm flex-shrink-0`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-4/6 h-4/6" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 11l1.5-5H15l1.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="6.5" cy="15.5" r="2" stroke="white" strokeWidth="1.5"/>
          <circle cx="16.5" cy="15.5" r="2" stroke="white" strokeWidth="1.5"/>
          <path d="M1 11h17M18.5 11l1.5-3h2l1 3-1 4.5h-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 15.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      {showText ? (
        <span
          className={`${styles.text} ${textVisibilityClass} font-bold tracking-tight ${textColor}`}
        >
          Delivo
        </span>
      ) : null}
    </div>
  );

  if (!clickable) {
    return content;
  }

  return (
    <Link to="/" aria-label="Delivo home" className="inline-flex">
      {content}
    </Link>
  );
};

export default BrandLogo;
