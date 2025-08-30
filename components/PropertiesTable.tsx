import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PropertiesTableProps {
  properties: any[];
  getAverageRating: (id: number, name: string) => string | null;
  getReviewCount: (id: number, name: string) => number;
  selectedProperty: number | null;
  setSelectedProperty: (id: number | null) => void;
}

export default function PropertiesTable({ properties, getAverageRating, getReviewCount, selectedProperty, setSelectedProperty }: PropertiesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Property</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Location</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Capacity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Rating</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Reviews</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property: any) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 text-sm">{property.name}</div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {property.city}, {property.countryCode}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {property.roomType.replace('_', ' ')}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {property.personCapacity} guests • {property.bedroomsNumber}br • {property.bathroomsNumber}ba
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  £{property.price}/night
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{getAverageRating(property.id, property.name) ?? 'N/A'}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {getReviewCount(property.id, property.name)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setSelectedProperty(selectedProperty === property.id ? null : property.id)}
                      className="text-purple-600 cursor-pointer hover:text-purple-700 text-sm font-medium transition-colors text-left"
                    >
                      {selectedProperty === property.id ? 'Hide Reviews' : 'View Reviews'}
                    </button>
                    <Link 
                      href={`/property/${property.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-800 text-sm font-medium transition-colors group"
                    >
                      View Property
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
