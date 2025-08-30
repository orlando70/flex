'use client'

import React, { useState } from 'react';
import { 
  Tv, 
  Wifi, 
  WifiOff, 
  ChefHat, 
  WashingMachine, 
  Wind, 
  Thermometer, 
  Shield, 
  ShieldAlert,
  X
} from 'lucide-react';

interface AmenitiesProps {
  amenities?: string[];
}

const AmenitiesComponent = ({ amenities }: AmenitiesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default amenities if none provided
  const defaultAmenities = [
    { icon: <Tv className="w-5 h-5" />, name: "Cable TV" },
    { icon: <Wifi className="w-5 h-5" />, name: "Internet" },
    { icon: <WifiOff className="w-5 h-5" />, name: "Wireless" },
    { icon: <ChefHat className="w-5 h-5" />, name: "Kitchen" },
    { icon: <WashingMachine className="w-5 h-5" />, name: "Washing Machine" },
    { icon: <Wind className="w-5 h-5" />, name: "Hair Dryer" },
    { icon: <Thermometer className="w-5 h-5" />, name: "Heating" },
    { icon: <Shield className="w-5 h-5" />, name: "Smoke Detector" },
    { icon: <ShieldAlert className="w-5 h-5" />, name: "Carbon Monoxide Detector" }
  ];

  // Convert amenities array to display format
  const basicAmenities = amenities ? amenities.slice(0, 9).map(amenity => ({
    icon: <Tv className="w-5 h-5" />, // Default icon, you could map specific icons based on amenity name
    name: amenity
  })) : defaultAmenities;

  // Categorize amenities for the modal
  const categorizeAmenities = (amenitiesList: string[]) => {
    const categories = {
      'Living room': ['Cable TV', 'TV', 'Smart TV', 'Private living room', 'Sofa', 'Armchair', 'Coffee Table', 'Bookshelf'],
      'Internet & office': ['Internet', 'Wireless', 'Free WiFi', 'WiFi speed (25+ Mbps)', 'Ethernet', 'Workspace', 'Printer'],
      'Kitchen & dining': ['Kitchen', 'Microwave', 'Electric kettle', 'Toaster', 'Oven', 'Stove', 'Dishwasher', 'Refrigerator', 'Freezer', 'Dining area', 'Dining table', 'Kitchen utensils', 'Wine glasses', 'Cookware'],
      'Bathroom': ['Shower', 'Tub', 'Toilet', 'Hot water', 'Towels', 'Shampoo', 'Shower gel', 'Body soap', 'Conditioner'],
      'Bedroom': ['Linens', 'Hangers', 'Clothing storage', 'Drying rack for clothing', 'Iron', 'Iron board'],
      'Safety & security': ['Smoke detector', 'Carbon Monoxide Detector', '24-hour checkin', 'Contactless Check-In/Out'],
      'Family friendly': ['Suitable for children', 'Suitable for infants', 'Long term stays allowed'],
      'Comfort': ['Heating', 'Air Conditioning', 'Portable fans', 'Essentials', 'Cleaning products', 'Enhanced Cleaning Practices']
    };

    const categorized: { [key: string]: string[] } = {};
    
    Object.entries(categories).forEach(([category, items]) => {
      const matchingAmenities = amenitiesList.filter(amenity => 
        items.some(item => amenity.toLowerCase().includes(item.toLowerCase()))
      );
      if (matchingAmenities.length > 0) {
        categorized[category] = matchingAmenities;
      }
    });

    // Add uncategorized amenities
    const categorizedAmenities = Object.values(categorized).flat();
    const uncategorized = amenitiesList.filter(amenity => 
      !categorizedAmenities.includes(amenity)
    );
    
    if (uncategorized.length > 0) {
      categorized['Other'] = uncategorized;
    }

    return categorized;
  };

  const allAmenities = amenities ? categorizeAmenities(amenities) : {
    'Living room': ['Cable TV', 'Private Living Room', 'Sofa', 'Armchair', 'Coffee Table', 'Bookshelf'],
    'Internet & office': ['Internet', 'Wireless', 'Free WiFi', 'Ethernet', 'Workspace', 'Printer'],
    'Kitchen & dining': ['Kitchen', 'Microwave', 'Electric Kettle', 'Toaster', 'Oven', 'Stove', 'Dishwasher', 'Refrigerator', 'Dining Table', 'Cookware']
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[22px] font-semibold text-gray-900">Amenities</h2>
          <button 
            className="border border-background rounded-md px-4 py-2 text-[15px] font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            View all amenities
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-y-6 gap-x-2">
          {basicAmenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-700">
              <span className="text-gray-500 flex items-center justify-center w-6 h-6">
                {amenity.icon}
              </span>
              <span className="text-[16px] font-normal">{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          style={{ minHeight: '100vh' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#f7f6f2] rounded-xl shadow-xl w-full max-w-2xl mx-auto relative"
            style={{ minWidth: 600, minHeight: 400, maxHeight: '80vh', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative p-7 pb-0 overflow-y-auto custom-scrollbar" style={{ maxHeight: '70vh' }}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[22px] font-semibold text-gray-900">All amenities</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-7 right-7 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  style={{ border: 'none', background: 'none' }}
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="divide-y divide-gray-300">
                {Object.entries(allAmenities).map(([category, items]) => (
                  <div key={category} className="py-2">
                    <div className="flex items-center mb-3">
                      <span className="font-semibold text-gray-900 text-[17px]">{category}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-900 text-[15px]">
                          <span className="w-2 h-2 rounded-full bg-green-700 inline-block"></span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 #f7f6f2;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: #f7f6f2;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .custom-scrollbar:hover::-webkit-scrollbar {
          opacity: 1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default AmenitiesComponent;