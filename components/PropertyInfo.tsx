'use client'

import { useState } from 'react';
import PropertyHeader from './PropertyHeader';

interface PropertyInfoProps {
  property?: any;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const description = property?.description || 
    'No description available for this property.';

  // Split description into paragraphs for better display
  const paragraphs = description.split('\n\n').filter(p => p.trim());

  return (
    <div className="">
      {/* About section */}
      <div className="pt-8 bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
        {showFullDescription ? (
          <>
            {paragraphs.map((paragraph: string, index: number) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-2">
                {paragraph}
              </p>
            ))}
            <button 
              onClick={() => setShowFullDescription(false)}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Show less
            </button>
          </>
        ) : (
          <div>
            <p className="text-gray-700 leading-relaxed mb-2">
              {paragraphs[0]}
            </p>
            {paragraphs.length > 1 && (
              <p className="text-gray-700">
                {paragraphs[1].length > 150 ? `${paragraphs[1].substring(0, 150)}...` : paragraphs[1]}
                <button 
                  onClick={() => setShowFullDescription(true)}
                  className="text-teal-600 hover:text-teal-700 font-medium ml-1"
                >
                  Read more
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}