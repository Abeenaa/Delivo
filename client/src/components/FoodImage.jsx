import { useState, useEffect } from 'react';

const FoodImage = ({ src, alt, className = '', fallback = "/assets/food.png" }) => {
  const [imageSrc, setImageSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  // Update image when src prop changes
  useEffect(() => {
    setImageSrc(src || fallback);
    setHasError(false);
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallback);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default FoodImage;