import React from "react";
import { Link } from "react-router-dom";

const sizeMap = {
  sm: {
    image: "h-7 w-7",
    text: "text-base",
    gap: "gap-2",
  },
  md: {
    image: "h-8 w-8",
    text: "text-lg",
    gap: "gap-2.5",
  },
  lg: {
    image: "h-10 w-10",
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
  const [hasImageError, setHasImageError] = React.useState(false);
  const styles = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center ${styles.gap}`}>
      {!hasImageError ? (
        <img
          src="/assets/abdi-logo.png"
          alt="AbdiDelivery logo"
          className={`${styles.image} rounded-full object-cover shadow-sm`}
          onError={() => setHasImageError(true)}
        />
      ) : null}
      {showText ? (
        <span
          className={`${styles.text} ${textVisibilityClass} font-bold tracking-tight ${textColor}`}
        >
          AbdiDelivery
        </span>
      ) : null}
    </div>
  );

  if (!clickable) {
    return content;
  }

  return (
    <Link to="/" aria-label="AbdiDelivery home" className="inline-flex">
      {content}
    </Link>
  );
};

export default BrandLogo;
