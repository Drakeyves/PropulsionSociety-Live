'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackSrc?: string;
}

/**
 * OptimizedImage component that handles fallbacks for missing images
 * It will try to load the original image, and if it fails, it will load the fallback image
 * If the fallback image is not provided, it will generate one based on the original src by replacing .jpg with .svg
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc,
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  const handleError = () => {
    if (!error) {
      // If fallbackSrc is provided, use it
      // Otherwise, try to generate a fallback by replacing .jpg with .svg
      const newSrc = fallbackSrc || src.replace(/\.jpg$/, '.svg');
      setImgSrc(newSrc);
      setError(true);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default OptimizedImage; 