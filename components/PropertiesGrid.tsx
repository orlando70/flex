import { Star, Building, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PropertiesGridProps {
  properties: any[];
  getAverageRating: (id: number, name: string) => string | null;
  getReviewCount: (id: number, name: string) => number;
  selectedProperty: number | null;
  setSelectedProperty: (id: number | null) => void;
}

export default function PropertiesGrid({ properties, getAverageRating, getReviewCount, selectedProperty, setSelectedProperty }: PropertiesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {properties.map((property: any) => (
        <div 
          key={property.id} 
          className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{property.name}</h3>
                <p className="text-xs text-gray-500">{property.city}, {property.countryCode}</p>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg ml-2">
                <Star className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">{getAverageRating(property.id, property.name) ?? 'N/A'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600 truncate">{property.roomType.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{property.personCapacity}</span>
              </div>
              <div className="text-gray-600">{property.bedroomsNumber}br {property.bathroomsNumber}ba</div>
              <div className="font-semibold text-gray-900">£{property.price}/nt</div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-4">
              <span className="text-xs text-gray-600">{getReviewCount(property.id, property.name)} reviews</span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedProperty(selectedProperty === property.id ? null : property.id);
                }}
                className="text-purple-600 hover:text-purple-700 text-xs font-medium transition-colors"
              >
                View Reviews
              </button>
            </div>
            
            {/* Call to Action Button */}
            <Link 
              href={`/property/${property.id}`}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group border border-gray-200"
            >
              View Property
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
