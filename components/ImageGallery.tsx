import Image from 'next/image';
import { useState } from 'react';

interface ImageGalleryProps {
  images?: string[];
}

export default function ImageGallery({ images = [] }: ImageGalleryProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // If no images provided, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative h-screen">
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-full">
          <div className="col-span-2 row-span-2 relative">
            <div className="w-full h-full bg-gray-200 rounded-l-2xl flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Take up to 5 images for the gallery
  const displayImages = images.slice(0, 5);

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const renderImage = (src: string, alt: string, index: number, className: string = "") => {
    if (imageErrors.has(index)) {
      return (
        <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
          <span className="text-gray-500 text-sm">Image failed to load</span>
        </div>
      );
    }

    return (
      <Image 
        src={src}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 25vw, 12.5vw"}
        priority={index === 0}
        onError={() => handleImageError(index)}
        unoptimized={src.startsWith('http')} // Disable optimization for external URLs
      />
    );
  };
  
  return (
    <div className="relative h-screen">
      <div className="grid grid-cols-4 grid-rows-2 gap-3 h-full">
        {/* Main large image */}
        <div className="col-span-2 row-span-2 relative">
          {renderImage(displayImages[0], "Main property image", 0, "rounded-l-2xl")}
        </div>
        
        {/* Top right image */}
        <div className="relative">
          {renderImage(displayImages[1] || displayImages[0], "Property image 2", 1)}
        </div>
        
        {/* Top far right image */}
        <div className="relative">
          {renderImage(displayImages[2] || displayImages[0], "Property image 3", 2)}
        </div>
        
        {/* Bottom right image */}
        <div className="relative">
          {renderImage(displayImages[3] || displayImages[0], "Property image 4", 3)}
        </div>
        
        {/* Bottom far right image with overlay button */}
        <div className="relative">
          {renderImage(displayImages[4] || displayImages[0], "Property image 5", 4)}
          {/* View all photos button overlay */}
          <div className="absolute bottom-3 right-3">
            <button className="bg-white/95 text-black px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-white flex items-center gap-2">
              <span className="text-gray-600">⊞</span>
              View all photos ({images.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}