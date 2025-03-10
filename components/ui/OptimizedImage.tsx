'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackSrc?: string;
  showLoadingPlaceholder?: boolean;
}

/**
 * OptimizedImage component that handles fallbacks for missing images
 * It will try to load the original image, and if it fails, it will load the fallback image
 * If the fallback image is not provided, it will generate one based on the original src
 * 
 * Features:
 * - Handles fallbacks for missing images
 * - Supports multiple image formats (.jpg, .jpeg, .png, .gif, etc.)
 * - Optional loading placeholder
 * - Improved error handling
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc,
  alt,
  showLoadingPlaceholder = false,
  className = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setError(false);
  }, [src]);

  const handleError = () => {
    if (!error) {
      // If fallbackSrc is provided, use it
      // Otherwise, generate a fallback by replacing the image extension with .svg
      const newSrc = fallbackSrc || src.replace(/\.(jpe?g|png|gif|webp|bmp|tiff)$/i, '.svg');
      
      console.warn(`Image failed to load: ${src}. Using fallback: ${newSrc}`);
      
      setImgSrc(newSrc);
      setError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {showLoadingPlaceholder && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-secondary animate-pulse">
          <svg className="w-10 h-10 text-metallic" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt || 'Image'}
        onError={handleError}
        onLoad={handleLoad}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${className}`}
      />
    </div>
  );
};

export default OptimizedImage; 